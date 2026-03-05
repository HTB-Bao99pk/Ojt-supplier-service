package com.group4.shift_service.controller;

import com.group4.shift_service.dto.request.ShiftCreateRequest;
import com.group4.shift_service.dto.request.ShiftUpdateRequest;
import com.group4.shift_service.dto.response.ApiResponse;
import com.group4.shift_service.dto.response.ShiftResponse;
import com.group4.shift_service.service.ShiftService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
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
            @RequestHeader(value = "USER", defaultValue = "admin_01") String user) {
        return ApiResponse.<ShiftResponse>builder()
                .code(201)
                .message("Shift created successfully")
                .result(shiftService.createShift(request, user))
                .build();
    }

    // GỘP LẠI THÀNH 1 API DUY NHẤT: Hỗ trợ phân trang
    @GetMapping
    public ApiResponse<Page<ShiftResponse>> getAllShifts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<Page<ShiftResponse>>builder()
                .code(200)
                .message("Fetch shifts successfully")
                .result(shiftService.getAllShifts(page, size)) // Gọi hàm có 2 tham số
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ShiftResponse> getShiftById(@PathVariable String id) {
        return ApiResponse.<ShiftResponse>builder()
                .code(200)
                .message("Fetch shift details successfully")
                .result(shiftService.getShiftById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ShiftResponse> updateShift(
            @PathVariable String id,
            @RequestBody @Valid ShiftUpdateRequest request,
            @RequestHeader(value = "USER", defaultValue = "admin_01") String user) {
        return ApiResponse.<ShiftResponse>builder()
                .code(200)
                .message("Shift updated successfully")
                .result(shiftService.updateShift(id, request, user))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteShift(@PathVariable String id) {
        shiftService.deleteShift(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Shift deleted successfully")
                .build();
    }
}