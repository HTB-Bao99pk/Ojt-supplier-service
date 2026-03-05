package com.group4.supplier_service.service;

import com.group4.supplier_service.dto.request.SupplierProductUpdateRequest;
import com.group4.supplier_service.dto.request.SupplierProductCreateRequest;
import com.group4.supplier_service.dto.request.SupplierProductFilterRequest;
import com.group4.supplier_service.dto.response.ProductResponse;
import com.group4.supplier_service.dto.response.SupplierComparisonResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SupplierProductService {
    Page<ProductResponse> getProductBySupplierId(String id, int page, int size);
    Page<ProductResponse> getSupplierProducts(SupplierProductFilterRequest request, org.springframework.data.domain.Pageable pageable);
    List<SupplierComparisonResponse> compareSuppliersByProduct(String productId);
    ProductResponse updateSupplierProduct(String productId, String supplierId, SupplierProductUpdateRequest request);
    ProductResponse createSupplierProduct(String supplierId, SupplierProductCreateRequest request);
}
