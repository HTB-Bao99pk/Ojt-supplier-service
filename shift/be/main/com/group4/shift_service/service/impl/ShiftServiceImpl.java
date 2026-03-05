package com.group4.shift_service.service.impl;

import com.group4.shift_service.dto.request.ShiftCreateRequest;
import com.group4.shift_service.dto.response.ShiftResponse;
import com.group4.shift_service.entity.Shift;
import com.group4.shift_service.repository.ShiftRepository;
import com.group4.shift_service.service.ShiftService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

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

        Shift savedShift = shiftRepository.save(shift);

        return ShiftResponse.builder()
                .id(savedShift.getId())
                .date(savedShift.getDate())
                .startTime(savedShift.getStartTime())
                .endTime(savedShift.getEndTime())
                .branchId(savedShift.getBranchId())
                .createBy(savedShift.getCreateBy())
                .createAt(savedShift.getCreateAt())
                .build();
    }
}