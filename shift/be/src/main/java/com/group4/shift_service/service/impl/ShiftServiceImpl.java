package com.group4.shift_service.service.impl;

import com.group4.shift_service.dto.request.ShiftCreateRequest;
import com.group4.shift_service.dto.request.ShiftUpdateRequest;
import com.group4.shift_service.dto.response.ShiftResponse;
import com.group4.shift_service.entity.Shift;
import com.group4.shift_service.repository.ShiftRepository;
import com.group4.shift_service.service.ShiftService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShiftServiceImpl implements ShiftService {

    ShiftRepository shiftRepository;

    @Override
    public ShiftResponse createShift(ShiftCreateRequest request, String user) {
        Shift shift = Shift.builder()
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .branchId(request.getBranchId())
                .createBy(user)
                .build();
        return mapToResponseWithStatus(shiftRepository.save(shift));
    }

    @Override
    public Page<ShiftResponse> getAllShifts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return shiftRepository.findAll(pageable).map(this::mapToResponseWithStatus);
    }

    // HÀM PHÂN TRANG (PAGINATION)
    public Page<ShiftResponse> getAllShiftsPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return shiftRepository.findAll(pageable).map(this::mapToResponseWithStatus);
    }

    @Override
    public ShiftResponse getShiftById(String id) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift not found with id: " + id));
        return mapToResponseWithStatus(shift);
    }

    @Override
    public ShiftResponse updateShift(String id, ShiftUpdateRequest request, String user) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift not found"));

        // CHẶN: Chỉ cho phép sửa nếu là ca trong tương lai (PREPARING)
        if (!getCalculateStatus(shift).equals("PREPARING")) {
            throw new RuntimeException("Only shifts in PREPARING status can be updated!");
        }

        shift.setDate(request.getDate());
        shift.setStartTime(request.getStartTime());
        shift.setEndTime(request.getEndTime());
        shift.setBranchId(request.getBranchId());
        shift.setUpdateBy(user);

        return mapToResponseWithStatus(shiftRepository.save(shift));
    }

    @Override
    public void deleteShift(String id) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift not found"));

        // CHẶN: Chỉ cho phép xóa nếu là ca trong tương lai (PREPARING)
        if (!getCalculateStatus(shift).equals("PREPARING")) {
            throw new RuntimeException("Only shifts in PREPARING status can be deleted!");
        }
        shiftRepository.deleteById(id);
    }

    // LOGIC TÍNH TRẠNG THÁI
    private String getCalculateStatus(Shift shift) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime shiftStart = LocalDateTime.of(shift.getDate(), shift.getStartTime());
        LocalDateTime shiftEnd = LocalDateTime.of(shift.getDate(), shift.getEndTime());

        if (now.isBefore(shiftStart)) return "PREPARING";
        if (now.isAfter(shiftEnd)) return "CLOSED";
        return "OPEN";
    }

    private ShiftResponse mapToResponseWithStatus(Shift shift) {
        return ShiftResponse.builder()
                .id(shift.getId())
                .date(shift.getDate())
                .startTime(shift.getStartTime())
                .endTime(shift.getEndTime())
                .branchId(shift.getBranchId())
                .status(getCalculateStatus(shift))
                .createBy(shift.getCreateBy())
                .createAt(shift.getCreateAt())
                .build();
    }

}