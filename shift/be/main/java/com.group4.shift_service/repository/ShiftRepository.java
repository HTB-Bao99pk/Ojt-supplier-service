package com.group4.shift_service.repository;

import com.group4.shift_service.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, String> {
}