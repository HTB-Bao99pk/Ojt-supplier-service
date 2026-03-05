package com.group4.shift_service.service.impl;

import com.group4.shift_service.dto.request.ShiftCreateRequest;
import com.group4.shift_service.dto.request.ShiftUpdateRequest;
import com.group4.shift_service.dto.response.ShiftResponse;
import com.group4.shift_service.dto.response.StaffResponse;
import com.group4.shift_service.entity.Shift;
import com.group4.shift_service.entity.ShiftAssignment;
import com.group4.shift_service.entity.Staff;
import com.group4.shift_service.exception.AppException;
import com.group4.shift_service.exception.ErrorCode;
import com.group4.shift_service.repository.ShiftAssignmentRepository;
import com.group4.shift_service.repository.ShiftRepository;
import com.group4.shift_service.repository.StaffRepository;
import com.group4.shift_service.service.ShiftService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShiftServiceImpl implements ShiftService {

    ShiftRepository shiftRepository;
    ShiftAssignmentRepository shiftAssignmentRepository;  // ← thêm mới
    StaffRepository staffRepository;            // ← thêm mới

    @Override
    public ShiftResponse createShift(ShiftCreateRequest request, String user) {
        Shift shift = Shift.builder()
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .branchId(request.getBranchId())
                .createBy(user)
                .build();
        return mapToResponse(shiftRepository.save(shift));
    }

    @Override
    public Page<ShiftResponse> getAllShifts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return shiftRepository.findAll(pageable).map(this::mapToResponse);
    }

    public Page<ShiftResponse> getAllShiftsPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return shiftRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public ShiftResponse getShiftById(String id) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHIFT_NOT_FOUND));
        return mapToResponse(shift);
    }

    @Override
    public ShiftResponse updateShift(String id, ShiftUpdateRequest request, String user) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHIFT_NOT_FOUND));

        if (!calculateStatus(shift).equals("PREPARING")) {
            throw new RuntimeException("Only shifts in PREPARING status can be updated!");
        }

        shift.setDate(request.getDate());
        shift.setStartTime(request.getStartTime());
        shift.setEndTime(request.getEndTime());
        shift.setBranchId(request.getBranchId());
        shift.setUpdateBy(user);

        return mapToResponse(shiftRepository.save(shift));
    }

    @Override
    public void deleteShift(String id) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHIFT_NOT_FOUND));

        if (!calculateStatus(shift).equals("PREPARING")) {
            throw new RuntimeException("Only shifts in PREPARING status can be deleted!");
        }
        shiftRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShiftResponse> getShiftsByDate(LocalDate date) {
        return shiftRepository.findAllByDate(date)
                .stream()
                .map(shift -> {
                    int staffCount = shiftAssignmentRepository
                            .findAllByShiftId(shift.getId()).size();
                    return mapToResponse(shift, staffCount);
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffResponse> getStaffByShift(String shiftId) {
        if (!shiftRepository.existsById(shiftId)) {
            throw new AppException(ErrorCode.SHIFT_NOT_FOUND);
        }

        List<String> staffIds = shiftAssignmentRepository
                .findAllByShiftId(shiftId)
                .stream()
                .map(ShiftAssignment::getStaffId)
                .toList();

        return staffRepository.findAllById(staffIds)
                .stream()
                .map(this::toStaffResponse)
                .toList();
    }

    private String calculateStatus(Shift shift) {
        LocalDateTime now        = LocalDateTime.now();
        LocalDateTime shiftStart = LocalDateTime.of(shift.getDate(), shift.getStartTime());
        LocalDateTime shiftEnd   = LocalDateTime.of(shift.getDate(), shift.getEndTime());

        if (now.isBefore(shiftStart)) return "PREPARING";
        if (now.isAfter(shiftEnd))    return "CLOSED";
        return "OPEN";
    }

    private ShiftResponse mapToResponse(Shift shift) {
        return ShiftResponse.builder()
                .id(shift.getId())
                .date(shift.getDate())
                .startTime(shift.getStartTime())
                .endTime(shift.getEndTime())
                .branchId(shift.getBranchId())
                .status(calculateStatus(shift))
                .createBy(shift.getCreateBy())
                .createAt(shift.getCreateAt())
                .build();
    }

    private ShiftResponse mapToResponse(Shift shift, int staffCount) {
        return ShiftResponse.builder()
                .id(shift.getId())
                .date(shift.getDate())
                .startTime(shift.getStartTime())
                .endTime(shift.getEndTime())
                .branchId(shift.getBranchId())
                .status(calculateStatus(shift))
                .createBy(shift.getCreateBy())
                .createAt(shift.getCreateAt())
                .staffCount(staffCount)
                .build();
    }

    private StaffResponse toStaffResponse(Staff s) {
        return StaffResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .email(s.getEmail())
                .branchId(s.getBranchId())
                .build();
    }
}