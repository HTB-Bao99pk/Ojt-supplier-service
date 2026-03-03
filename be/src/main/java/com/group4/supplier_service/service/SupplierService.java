package com.group4.supplier_service.service;

import com.group4.supplier_service.dto.request.SupplierCreateRequest;
import com.group4.supplier_service.dto.response.SupplierResponse;
import com.group4.supplier_service.dto.request.SupplierUpdateRequest;
import org.springframework.data.domain.Page;

public interface SupplierService {

    SupplierResponse updateSupplier(String supplierId, SupplierUpdateRequest dto, String updatedBy);

    SupplierResponse toggleSuspend(String supplierId, String updatedBy);

    Page<SupplierResponse> getAllSuppliers(int page, int size);

    SupplierResponse createSupplier(SupplierCreateRequest dto, String createdBy);

    SupplierResponse approveSupplier(String supplierId, String approvedBy);

    SupplierResponse getSupplierById(String id);

    Page<SupplierResponse> getSuppliersByNameOrEmailOrPhone(String keyword, int page, int size);
}