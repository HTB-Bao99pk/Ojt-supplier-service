package com.group4.shift_service.service.impl;

import com.group4.shift_service.dto.request.AttendanceItemRequest;
import com.group4.shift_service.dto.request.BulkMarkAttendanceRequest;
import com.group4.shift_service.dto.response.AttendanceReportResponse;
import com.group4.shift_service.dto.response.AttendanceResponse;
import com.group4.shift_service.dto.response.DashboardOverviewResponse;
import com.group4.shift_service.dto.response.TimelineItemResponse;
import com.group4.shift_service.entity.Attendance;
import com.group4.shift_service.entity.Shift;
import com.group4.shift_service.entity.ShiftAssignment;
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

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
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
    public List<AttendanceResponse> bulkMarkAttendance(String shiftId, BulkMarkAttendanceRequest request, String markedBy) {
        Shift shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new AppException(ErrorCode.SHIFT_NOT_FOUND));

        Set<String> assignedIds = shiftAssignmentRepository.findAllByShiftId(shiftId)
                .stream().map(ShiftAssignment::getStaffId).collect(Collectors.toSet());

        List<String> requestedStaffIds = request.getAttendances().stream()
                .map(AttendanceItemRequest::getStaffId).distinct().toList();

        Map<String, String> staffNameMap = staffRepository.findAllById(requestedStaffIds)
                .stream().collect(Collectors.toMap(Staff::getId, Staff::getName));

        for (AttendanceItemRequest item : request.getAttendances()) {
            if (!assignedIds.contains(item.getStaffId())) {
                throw new AppException(ErrorCode.STAFF_NOT_IN_SHIFT, item.getStaffId());
            }
        }

        Map<String, Attendance> existingMap = attendanceRepository.findAllByShiftId(shiftId)
                .stream().collect(Collectors.toMap(Attendance::getStaffId, a -> a));

        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        List<Attendance> toSave = request.getAttendances().stream().map(item -> {
            Attendance existing = existingMap.get(item.getStaffId());
            AttendanceStatus actualStatus = item.getStatus();

            Integer lateMins = existing != null ? existing.getLateMinutes() : null;
            Integer earlyMins = existing != null ? existing.getEarlyLeaveMinutes() : null;

            if (item.getStatus() == AttendanceStatus.PRESENT) {
                LocalDateTime shiftStart = LocalDateTime.of(shift.getDate(), shift.getStartTime());
                long diff = Duration.between(shiftStart, now).toMinutes();
                lateMins = Math.max(0, (int) diff);
                actualStatus = lateMins > 0 ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
            }
            else if (item.getStatus() == AttendanceStatus.EARLY_LEAVE) {
                LocalDateTime shiftEnd = LocalDateTime.of(shift.getDate(), shift.getEndTime());
                long diff = Duration.between(now, shiftEnd).toMinutes();
                earlyMins = Math.max(0, (int) diff);
                if (earlyMins > 0) {
                    actualStatus = AttendanceStatus.EARLY_LEAVE;
                } else {
                    actualStatus = (existing != null && existing.getStatus() == AttendanceStatus.LATE) ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
                }
            }
            else if (item.getStatus() == AttendanceStatus.ABSENT) {
                actualStatus = AttendanceStatus.ABSENT;
                lateMins = 0; earlyMins = 0;
            }

            if (existing != null) {
                existing.setStatus(actualStatus);
                existing.setLateMinutes(lateMins);
                existing.setEarlyLeaveMinutes(earlyMins);
                existing.setUpdatedBy(markedBy);
                return existing;
            } else {
                return Attendance.builder()
                        .shiftId(shiftId).staffId(item.getStaffId()).status(actualStatus)
                        .lateMinutes(lateMins).earlyLeaveMinutes(earlyMins).markedBy(markedBy).build();
            }
        }).toList();

        return attendanceRepository.saveAll(toSave).stream()
                .map(a -> toResponse(a, staffNameMap.get(a.getStaffId()))).toList();
    }

    @Override
    public AttendanceResponse updateAttendance(String attendanceId, AttendanceItemRequest request, String updatedBy) {
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceByShift(String shiftId) {
        if (!shiftRepository.existsById(shiftId)) throw new AppException(ErrorCode.SHIFT_NOT_FOUND);
        List<Attendance> list = attendanceRepository.findAllByShiftId(shiftId);
        Map<String, String> staffNameMap = staffRepository
                .findAllById(list.stream().map(Attendance::getStaffId).toList())
                .stream().collect(Collectors.toMap(Staff::getId, Staff::getName));

        return list.stream().map(a -> toResponse(a, staffNameMap.getOrDefault(a.getStaffId(), "Unknown"))).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceReportResponse> getAttendanceReport(int month, int year) {
        List<Staff> staffs = staffRepository.findAll();

        // ĐÃ CẬP NHẬT: Chỉ lấy các ca làm việc thuộc tháng và năm được yêu cầu
        List<Shift> allShifts = shiftRepository.findAll().stream()
                .filter(s -> s.getDate().getMonthValue() == month && s.getDate().getYear() == year)
                .toList();

        List<ShiftAssignment> assignments = shiftAssignmentRepository.findAll();
        List<Attendance> attendances = attendanceRepository.findAll();
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        return staffs.stream().map(staff -> {
            int totalAssignedMins = 0, penaltyMins = 0, presentCount = 0, absentCount = 0, lateMins = 0, earlyMins = 0, validShiftsCount = 0;

            // Lọc ra các ca mà nhân viên này được phân công (đã bị giới hạn trong tháng ở trên)
            List<Shift> staffShifts = assignments.stream()
                    .filter(a -> a.getStaffId().equals(staff.getId()))
                    .map(a -> allShifts.stream().filter(s -> s.getId().equals(a.getShiftId())).findFirst().orElse(null))
                    .filter(s -> s != null).toList();

            for (Shift shift : staffShifts) {
                LocalDateTime shiftStart = LocalDateTime.of(shift.getDate(), shift.getStartTime());
                if (!now.isBefore(shiftStart)) {
                    validShiftsCount++;
                    int shiftDuration = (int) Duration.between(shift.getStartTime(), shift.getEndTime()).toMinutes();
                    totalAssignedMins += shiftDuration;

                    Attendance record = attendances.stream()
                            .filter(a -> a.getShiftId().equals(shift.getId()) && a.getStaffId().equals(staff.getId()))
                            .findFirst().orElse(null);

                    if (record != null) {
                        if (record.getStatus() == AttendanceStatus.ABSENT) {
                            absentCount++; penaltyMins += shiftDuration;
                        } else {
                            presentCount++;
                            lateMins += (record.getLateMinutes() != null ? record.getLateMinutes() : 0);
                            earlyMins += (record.getEarlyLeaveMinutes() != null ? record.getEarlyLeaveMinutes() : 0);
                            penaltyMins += (lateMins + earlyMins);
                        }
                    } else {
                        LocalDateTime shiftEnd = LocalDateTime.of(shift.getDate(), shift.getEndTime()).plusMinutes(30);
                        if (now.isAfter(shiftEnd)) {
                            absentCount++; penaltyMins += shiftDuration;
                        }
                    }
                }
            }

            double coverage = 0.0; // Mặc định là 0 nếu không có ca nào
            if (totalAssignedMins > 0) {
                int workedMins = Math.max(0, totalAssignedMins - penaltyMins);
                coverage = Math.round(((double) workedMins / totalAssignedMins) * 100.0);
            }

            return AttendanceReportResponse.builder()
                    .staffId(staff.getId())
                    .staffCode(staff.getStaffCode() != null ? staff.getStaffCode() : "N/A")
                    .staffName(staff.getName())
                    .assignedShifts(validShiftsCount)
                    .presentCount(presentCount)
                    .absentCount(absentCount)
                    .totalLateMins(lateMins)
                    .totalEarlyMins(earlyMins)
                    .coveragePercentage(coverage)
                    .build();
        }).sorted((a, b) -> Double.compare(b.getCoveragePercentage(), a.getCoveragePercentage())).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardOverviewResponse getDashboardOverview(LocalDate date) {
        List<Shift> shifts = shiftRepository.findAllByDate(date);

        int totalAssigned = 0, presentCount = 0, absentCount = 0, pendingCount = 0;
        List<TimelineItemResponse> timeline = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        for (Shift shift : shifts) {
            List<ShiftAssignment> assignments = shiftAssignmentRepository.findAllByShiftId(shift.getId());
            List<Attendance> attendances = attendanceRepository.findAllByShiftId(shift.getId());

            int shiftAssignedCount = assignments.size();
            totalAssigned += shiftAssignedCount;
            int shiftPresentCount = 0;

            for (ShiftAssignment assignment : assignments) {
                Attendance record = attendances.stream()
                        .filter(a -> a.getStaffId().equals(assignment.getStaffId()))
                        .findFirst().orElse(null);

                if (record != null) {
                    if (record.getStatus() == AttendanceStatus.PRESENT || record.getStatus() == AttendanceStatus.LATE || record.getStatus() == AttendanceStatus.EARLY_LEAVE) {
                        presentCount++; shiftPresentCount++;
                    } else if (record.getStatus() == AttendanceStatus.ABSENT) {
                        absentCount++;
                    } else {
                        pendingCount++;
                    }
                } else {
                    pendingCount++;
                }
            }

            boolean isFull = (shiftPresentCount == shiftAssignedCount) && (shiftAssignedCount > 0);
            String timeStr = shift.getStartTime().toString().substring(0, 5) + " - " + shift.getEndTime().toString().substring(0, 5);

            // CHÍNH LÀ HÀM NÀY ĐÂY!
            String currentStatus = calculateShiftStatus(shift, now);

            timeline.add(TimelineItemResponse.builder()
                    .id(shift.getId())
                    .shiftName("Ca làm việc (" + currentStatus + ")")
                    .time(timeStr)
                    .presentStaff(shiftPresentCount)
                    .assignedStaff(shiftAssignedCount)
                    .status(isFull ? "FULL" : "MISSING")
                    .branchId(shift.getBranchId())
                    .build());
        }

        timeline.sort((a, b) -> a.getTime().compareTo(b.getTime()));
        int coverage = totalAssigned > 0 ? Math.round(((float) presentCount / totalAssigned) * 100) : 0;

        return DashboardOverviewResponse.builder()
                .totalShifts(shifts.size())
                .staffOnDuty(presentCount)
                .coverageRate(coverage + "%")
                .pendingCheckIns(pendingCount)
                .absentStaff(absentCount)
                .timeline(timeline)
                .build();
    }

    // ĐÂY LÀ HÀM BỊ MẤT TRƯỚC ĐÓ, ĐẢM BẢO NÓ NẰM BÊN TRONG CLASS VÀ TRƯỚC DẤU NGOẶC CUỐI CÙNG }
    private String calculateShiftStatus(Shift shift, LocalDateTime now) {
        LocalDateTime shiftStart = LocalDateTime.of(shift.getDate(), shift.getStartTime());
        LocalDateTime shiftEnd = LocalDateTime.of(shift.getDate(), shift.getEndTime());

        LocalDateTime allowCheckInTime = shiftStart.minusMinutes(30);
        LocalDateTime closeTime = shiftEnd.plusMinutes(30);

        if (now.isBefore(allowCheckInTime)) return "PREPARING";
        else if (now.isAfter(closeTime)) return "CLOSED";
        else return "OPEN";
    }

    private AttendanceResponse toResponse(Attendance a, String staffName) {
        return AttendanceResponse.builder()
                .id(a.getId()).shiftId(a.getShiftId()).staffId(a.getStaffId())
                .staffName(staffName).status(a.getStatus())
                .lateMinutes(a.getLateMinutes()).earlyLeaveMinutes(a.getEarlyLeaveMinutes())
                .markedBy(a.getMarkedBy()).markedAt(a.getMarkedAt()).updatedAt(a.getUpdatedAt())
                .build();
    }
}