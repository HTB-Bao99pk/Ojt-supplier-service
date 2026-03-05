// main/java/com/group4/shift_service/service/impl/StaffServiceImpl.java
package com.group4.shift_service.service.impl;

import com.group4.shift_service.dto.request.StaffCreateRequest;
import com.group4.shift_service.dto.response.StaffResponse;
import com.group4.shift_service.entity.Staff;
import com.group4.shift_service.exception.AppException;
import com.group4.shift_service.exception.ErrorCode;
import com.group4.shift_service.repository.StaffRepository;
import com.group4.shift_service.service.StaffService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StaffServiceImpl implements StaffService {
    StaffRepository staffRepository;

    @Override
    public StaffResponse createStaff(StaffCreateRequest request) {
        if (staffRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already exists");

        Staff staff = Staff.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .branchId(request.getBranchId())
                .dateOfBirth(request.getDateOfBirth())
                .build();
        return mapToResponse(staffRepository.save(staff));
    }

    @Override
    public StaffResponse updateStaff(String id, StaffCreateRequest request) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND, id));

        staff.setName(request.getName());
        staff.setPhone(request.getPhone());
        staff.setBranchId(request.getBranchId());
        staff.setDateOfBirth(request.getDateOfBirth());

        return mapToResponse(staffRepository.save(staff));
    }

    @Override
    public void deleteStaff(String id) {
        if (!staffRepository.existsById(id))
            throw new AppException(ErrorCode.STAFF_NOT_FOUND, id);
        staffRepository.deleteById(id);
    }

    @Override
    public StaffResponse getStaffById(String id) {
        return staffRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND, id));
    }

    @Override
    public Page<StaffResponse> getAllStaffs(int page, int size) {
        return staffRepository.findAll(PageRequest.of(page, size)).map(this::mapToResponse);
    }

    private StaffResponse mapToResponse(Staff s) {
        return StaffResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .branchId(s.getBranchId())
                .status(s.getStatus())
                .dateOfBirth(s.getDateOfBirth())
                .createdAt(s.getCreatedAt())
                .build();
    }
}