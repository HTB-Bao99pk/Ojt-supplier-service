package com.group4.shift_service.service.impl;

import com.group4.shift_service.dto.request.AttendanceItemRequest;
import com.group4.shift_service.dto.request.BulkMarkAttendanceRequest;
import com.group4.shift_service.dto.response.AttendanceResponse;
import com.group4.shift_service.entity.Attendance;
import com.group4.shift_service.entity.Staff;
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
        if (!shiftRepository.existsById(shiftId)) {
            throw new AppException(ErrorCode.SHIFT_NOT_FOUND);
        }


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
                throw new AppException(ErrorCode.STAFF_NOT_IN_SHIFT, item.getStaffId());
            }
            if (!staffNameMap.containsKey(item.getStaffId())) {
                throw new AppException(ErrorCode.STAFF_NOT_FOUND, item.getStaffId());
            }
        }

        Map<String, Attendance> existingMap = attendanceRepository
                .findAllByShiftId(shiftId)
                .stream()
                .collect(Collectors.toMap(Attendance::getStaffId, a -> a));

        List<Attendance> toSave = request.getAttendances().stream()
                .map(item -> {
                    if (existingMap.containsKey(item.getStaffId())) {
                        // UPDATE
                        Attendance existing = existingMap.get(item.getStaffId());
                        existing.setStatus(item.getStatus());
                        existing.setNote(item.getNote());
                        existing.setUpdatedBy(markedBy);
                        return existing;
                    } else {
                        // INSERT
                        return Attendance.builder()
                                .shiftId(shiftId)
                                .staffId(item.getStaffId())
                                .status(item.getStatus())
                                .note(item.getNote())
                                .markedBy(markedBy)
                                .build();
                    }
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

        attendance.setStatus(request.getStatus());
        attendance.setNote(request.getNote());
        attendance.setUpdatedBy(updatedBy);
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