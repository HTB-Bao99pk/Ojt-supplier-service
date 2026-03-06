package com.group4.supplier_service.repository;

import com.group4.supplier_service.entity.SupplierAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierAuditLogRepository extends JpaRepository<SupplierAuditLog, String> {
    Page<SupplierAuditLog> findBySupplierIdOrderByPerformedAtDesc(String supplierId, Pageable pageable);

}
