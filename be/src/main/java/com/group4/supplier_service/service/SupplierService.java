package com.group4.supplier_service.service;

import com.group4.supplier_service.dto.request.SupplierCreateRequest;
import com.group4.supplier_service.dto.response.SupplierResponse;
import com.group4.supplier_service.dto.request.SupplierUpdateRequest;
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

    SupplierResponse approveSupplier(String supplierId, String approvedBy);

    SupplierResponse getSupplierById(String id);

    Page<SupplierResponse> getSuppliersByNameOrEmailOrPhone(String keyword, int page, int size);

    Page<SupplierResponse> filterSuppliers(SupplierStatus status, String region, BigDecimal minRating, LocalDateTime updatedAfter, Pageable pageable);
}