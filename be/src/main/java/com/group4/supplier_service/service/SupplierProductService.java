package com.group4.supplier_service.service;

import com.group4.supplier_service.dto.ProductResponse;
import org.springframework.data.domain.Page;

public interface SupplierProductService {
    Page<ProductResponse> getProductBySupplierId(String id, int page, int size);
}
