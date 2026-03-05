package com.group4.shift_service.repository;

import com.group4.shift_service.entity.ShiftAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, String> {
    List<ShiftAssignment> findAllByShiftId(String shiftId);
    boolean existsByShiftIdAndStaffId(String shiftId, String staffId);
}