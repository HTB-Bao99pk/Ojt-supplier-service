package com.group4.supplier_service.repository;

import com.group4.supplier_service.entity.SupplierAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierAuditLogRepository extends JpaRepository<SupplierAuditLog, String> {
}
