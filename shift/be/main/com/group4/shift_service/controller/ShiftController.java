package com.group4.shift_service.controller;

import com.group4.shift_service.dto.request.ShiftCreateRequest;
import com.group4.shift_service.dto.response.ApiResponse;
import com.group4.shift_service.dto.response.ShiftResponse;
import com.group4.shift_service.service.ShiftService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shifts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShiftController {

    ShiftService shiftService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ShiftResponse> createShift(
            @RequestBody @Valid ShiftCreateRequest request,
            @RequestHeader(value = "USER", defaultValue = "admin_user") String user) {

        ShiftResponse result = shiftService.createShift(request, user);

        return ApiResponse.<ShiftResponse>builder()
                .code(201)
                .message("Shift created successfully")
                .result(result)
                .build();
    }
}