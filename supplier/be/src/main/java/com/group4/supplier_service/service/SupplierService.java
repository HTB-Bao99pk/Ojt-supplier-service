package com.group4.supplier_service.service;

import com.group4.supplier_service.dto.response.DashboardSummaryResponse;
import com.group4.supplier_service.dto.request.SupplierCreateRequest;
import com.group4.supplier_service.dto.response.SupplierResponse;
import com.group4.supplier_service.dto.request.SupplierUpdateRequest;
import com.group4.supplier_service.entity.SupplierAuditLog;
import com.group4.supplier_service.enums.SupplierStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface SupplierService {

    SupplierResponse updateSupplier(String supplierId, SupplierUpdateRequest dto, String updatedBy);

    SupplierResponse toggleSuspend(String supplierId, String updatedBy);

    Page<SupplierResponse> getAllSuppliers(int page, int size);

    SupplierResponse createSupplier(SupplierCreateRequest dto, String createdBy);

    SupplierResponse reviewSupplier(String supplierId, SupplierStatus status, String reason, String reviewedBy);

    SupplierResponse getSupplierById(String id);

    Page<SupplierResponse> getSuppliersByNameOrEmailOrPhone(String keyword, int page, int size);

    Page<SupplierResponse> filterSuppliers(SupplierStatus status, String region, BigDecimal minRating, LocalDateTime updatedAfter, Pageable pageable);

    Page<SupplierResponse> getApprovedSuppliers(int page, int size);

    Page<SupplierAuditLog> getAuditLogsBySupplierId(String supplierId, int page, int size);

    void deleteSupplier(String supplierId, String deleteBy);

    DashboardSummaryResponse getDashboardSummary();


}