package com.group4.supplier_service.service;

import com.group4.supplier_service.dto.SupplierUpdateRequest;
import com.group4.supplier_service.entity.Supplier;

public interface SupplierService {
    Supplier updateSupplier(String supplierId, SupplierUpdateRequest dto, String updatedBy);
    Supplier toggleSuspend(String supplierId, String updatedBy);
}
