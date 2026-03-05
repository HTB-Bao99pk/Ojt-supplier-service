package com.group4.shift_service.repository;

import com.group4.shift_service.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepository extends JpaRepository<Staff, String> {
}