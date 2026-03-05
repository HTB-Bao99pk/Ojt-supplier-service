package com.group4.shift_service.controller;

import com.group4.shift_service.dto.request.AttendanceItemRequest;
import com.group4.shift_service.dto.request.BulkMarkAttendanceRequest;
import com.group4.shift_service.dto.response.ApiResponse;
import com.group4.shift_service.dto.response.AttendanceResponse;
import com.group4.shift_service.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shifts/{shiftId}/attendance")   // ← đổi từ /api/v1/shifts/... về /shifts/...
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AttendanceController {

    AttendanceService attendanceService;

    // GET /shifts/{shiftId}/attendance
    @GetMapping
    public ApiResponse<List<AttendanceResponse>> getByShift(
            @PathVariable String shiftId) {
        return ApiResponse.<List<AttendanceResponse>>builder()
                .message("Attendance retrieved successfully")
                .result(attendanceService.getAttendanceByShift(shiftId))
                .build();
    }

    // POST /shifts/{shiftId}/attendance/bulk
    @PostMapping("/bulk")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<List<AttendanceResponse>> bulkMark(
            @PathVariable String shiftId,
            @RequestBody @Valid BulkMarkAttendanceRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "manager-001") String markedBy) {
        return ApiResponse.<List<AttendanceResponse>>builder()
                .message("Attendance marked successfully")
                .result(attendanceService.bulkMarkAttendance(shiftId, request, markedBy))
                .build();
    }

    // PATCH /shifts/{shiftId}/attendance/{attendanceId}
    @PatchMapping("/{attendanceId}")
    public ApiResponse<AttendanceResponse> update(
            @PathVariable String shiftId,
            @PathVariable String attendanceId,
            @RequestBody @Valid AttendanceItemRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "manager-001") String updatedBy) {
        return ApiResponse.<AttendanceResponse>builder()
                .message("Attendance updated successfully")
                .result(attendanceService.updateAttendance(attendanceId, request, updatedBy))
                .build();
    }
}