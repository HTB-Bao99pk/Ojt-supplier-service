package com.group4.shift_service.service.impl;

import com.group4.shift_service.dto.request.AttendanceItemRequest;
import com.group4.shift_service.dto.request.BulkMarkAttendanceRequest;
import com.group4.shift_service.dto.response.AttendanceResponse;
import com.group4.shift_service.entity.Attendance;
import com.group4.shift_service.entity.Shift;
import com.group4.shift_service.entity.Staff;
import com.group4.shift_service.enums.AttendanceStatus;
import com.group4.shift_service.exception.AppException;
import com.group4.shift_service.exception.ErrorCode;
import com.group4.shift_service.repository.AttendanceRepository;
import com.group4.shift_service.repository.ShiftAssignmentRepository;
import com.group4.shift_service.repository.ShiftRepository;
import com.group4.shift_service.repository.StaffRepository;
import com.group4.shift_service.service.AttendanceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AttendanceServiceImpl implements AttendanceService {

    AttendanceRepository attendanceRepository;
    ShiftRepository shiftRepository;
    ShiftAssignmentRepository shiftAssignmentRepository;
    StaffRepository staffRepository;

    @Override
    @Transactional
    public List<AttendanceResponse> bulkMarkAttendance(String shiftId,
                                                       BulkMarkAttendanceRequest request,
                                                       String markedBy) {
        // Lấy thông tin ca làm việc để đối chiếu giờ (Bắt buộc phải có để tính trễ/sớm)
        Shift shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new AppException(ErrorCode.SHIFT_NOT_FOUND));

        Set<String> assignedIds = shiftAssignmentRepository
                .findAllByShiftId(shiftId)
                .stream()
                .map(a -> a.getStaffId())
                .collect(Collectors.toSet());

        List<String> requestedStaffIds = request.getAttendances().stream()
                .map(AttendanceItemRequest::getStaffId)
                .distinct()
                .toList();

        Map<String, String> staffNameMap = staffRepository
                .findAllById(requestedStaffIds)
                .stream()
                .collect(Collectors.toMap(Staff::getId, Staff::getName));

        for (AttendanceItemRequest item : request.getAttendances()) {
            if (!assignedIds.contains(item.getStaffId())) {
                throw new AppException(ErrorCode.STAFF_NOT_IN_SHIFT);
            }
            if (!staffNameMap.containsKey(item.getStaffId())) {
                throw new AppException(ErrorCode.STAFF_NOT_FOUND);
            }
        }

        Map<String, Attendance> existingMap = attendanceRepository
                .findAllByShiftId(shiftId)
                .stream()
                .collect(Collectors.toMap(Attendance::getStaffId, a -> a));

        List<Attendance> toSave = request.getAttendances().stream()
                .map(item -> {
                    Attendance attendance;
                    if (existingMap.containsKey(item.getStaffId())) {
                        // UPDATE
                        attendance = existingMap.get(item.getStaffId());
                        attendance.setUpdatedBy(markedBy);
                    } else {
                        // INSERT
                        attendance = Attendance.builder()
                                .shiftId(shiftId)
                                .staffId(item.getStaffId())
                                .markedBy(markedBy)
                                .build();
                    }

                    // GỌI HÀM TÍNH TOÁN LOGIC THỜI GIAN THỰC TẾ
                    applyAttendanceLogic(shift, item, attendance);

                    return attendance;
                })
                .toList();

        List<Attendance> saved = attendanceRepository.saveAll(toSave);

        return saved.stream()
                .map(a -> toResponse(a, staffNameMap.get(a.getStaffId())))
                .toList();
    }

    @Override
    @Transactional
    public AttendanceResponse updateAttendance(String attendanceId,
                                               AttendanceItemRequest request,
                                               String updatedBy) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new AppException(ErrorCode.ATTENDANCE_NOT_FOUND));

        // Lấy thông tin ca để đối chiếu
        Shift shift = shiftRepository.findById(attendance.getShiftId())
                .orElseThrow(() -> new AppException(ErrorCode.SHIFT_NOT_FOUND));

        attendance.setUpdatedBy(updatedBy);

        // GỌI HÀM TÍNH TOÁN LOGIC THỜI GIAN THỰC TẾ
        applyAttendanceLogic(shift, request, attendance);

        attendance = attendanceRepository.save(attendance);

        String staffName = staffRepository.findById(attendance.getStaffId())
                .map(Staff::getName)
                .orElse("Unknown");

        return toResponse(attendance, staffName);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceByShift(String shiftId) {
        if (!shiftRepository.existsById(shiftId)) {
            throw new AppException(ErrorCode.SHIFT_NOT_FOUND);
        }

        List<Attendance> list = attendanceRepository.findAllByShiftId(shiftId);

        Map<String, String> staffNameMap = staffRepository
                .findAllById(list.stream().map(Attendance::getStaffId).toList())
                .stream()
                .collect(Collectors.toMap(Staff::getId, Staff::getName));

        return list.stream()
                .map(a -> toResponse(a, staffNameMap.getOrDefault(a.getStaffId(), "Unknown")))
                .toList();
    }

    // ================= HÀM XỬ LÝ LOGIC ĐIỂM DANH THÔNG MINH =================
    private void applyAttendanceLogic(Shift shift, AttendanceItemRequest item, Attendance attendance) {
        // 1. Nếu admin chủ động báo vắng mặt hoàn toàn
        if (item.getStatus() == AttendanceStatus.ABSENT) {
            attendance.setStatus(AttendanceStatus.ABSENT);
            attendance.setNote(item.getNote() != null ? item.getNote() : "Vắng mặt");
            return;
        }

        LocalTime now = LocalTime.now();
        LocalTime startTime = shift.getStartTime();
        LocalTime endTime = shift.getEndTime();
        LocalTime allowedLateTime = startTime.plusMinutes(10); // Cấu hình Grace Period: 10 phút

        String customNote = (item.getNote() != null && !item.getNote().trim().isEmpty())
                ? " | Note: " + item.getNote() : "";

        // 2. TRƯỜNG HỢP: LÚC CHECK-IN (Admin gửi lên trạng thái PRESENT)
        if (item.getStatus() == AttendanceStatus.PRESENT || item.getStatus() == AttendanceStatus.LATE) {
            if (now.isAfter(allowedLateTime)) {
                long minutesLate = ChronoUnit.MINUTES.between(startTime, now);
                attendance.setStatus(AttendanceStatus.LATE);
                attendance.setNote("Đi trễ " + minutesLate + " phút" + customNote);
            } else {
                attendance.setStatus(AttendanceStatus.PRESENT);
                attendance.setNote("Đi đúng giờ" + customNote);
            }
        }
        // 3. TRƯỜNG HỢP: LÚC CHECK-OUT (Admin gửi lên trạng thái EARLY_LEAVE để xét về sớm)
        else if (item.getStatus() == AttendanceStatus.EARLY_LEAVE) {
            if (now.isBefore(endTime)) {
                long minutesEarly = ChronoUnit.MINUTES.between(now, endTime);
                attendance.setStatus(AttendanceStatus.EARLY_LEAVE);
                attendance.setNote("Về sớm " + minutesEarly + " phút" + customNote);
            } else {
                attendance.setStatus(AttendanceStatus.PRESENT); // Về đúng giờ thì tính là Present trọn vẹn
                attendance.setNote("Về đúng giờ" + customNote);
            }
        }
    }

    private AttendanceResponse toResponse(Attendance a, String staffName) {
        return AttendanceResponse.builder()
                .id(a.getId())
                .shiftId(a.getShiftId())
                .staffId(a.getStaffId())
                .staffName(staffName)
                .status(a.getStatus())
                .note(a.getNote())
                .markedBy(a.getMarkedBy())
                .markedAt(a.getMarkedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}