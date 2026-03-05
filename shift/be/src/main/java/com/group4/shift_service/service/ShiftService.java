package com.group4.shift_service.service;

import com.group4.shift_service.dto.request.ShiftCreateRequest;
import com.group4.shift_service.dto.request.ShiftUpdateRequest;
import com.group4.shift_service.dto.response.ShiftResponse;
import org.springframework.data.domain.Page;

public interface ShiftService {
    ShiftResponse createShift(ShiftCreateRequest request, String user);
    ShiftResponse getShiftById(String id);
    ShiftResponse updateShift(String id, ShiftUpdateRequest request, String user);
    void deleteShift(String id);

    Page<ShiftResponse> getAllShifts(int page, int size);
}