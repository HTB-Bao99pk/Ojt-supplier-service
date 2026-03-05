package com.group4.shift_service.service;

import com.group4.shift_service.dto.request.ShiftCreateRequest;
import com.group4.shift_service.dto.response.ShiftResponse;

public interface ShiftService {
    ShiftResponse createShift(ShiftCreateRequest request, String user);
}