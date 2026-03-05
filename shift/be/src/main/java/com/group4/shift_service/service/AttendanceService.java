package com.group4.shift_service.service;

import com.group4.shift_service.dto.request.AttendanceItemRequest;
import com.group4.shift_service.dto.request.BulkMarkAttendanceRequest;
import com.group4.shift_service.dto.response.AttendanceResponse;

import java.util.List;

public interface AttendanceService {
    List<AttendanceResponse> bulkMarkAttendance(String shiftId,
                                                BulkMarkAttendanceRequest request,
                                                String markedBy);

    AttendanceResponse updateAttendance(String attendanceId,
                                        AttendanceItemRequest request,
                                        String updatedBy);

    List<AttendanceResponse> getAttendanceByShift(String shiftId);
}