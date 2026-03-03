package com.group4.supplier_service.service;

import com.group4.supplier_service.dto.response.ProductResponse;
import com.group4.supplier_service.dto.response.SupplierComparisonResponse;
import com.group4.supplier_service.entity.SupplierProduct;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SupplierProductService {
    Page<ProductResponse> getProductBySupplierId(String id, int page, int size);
    List<SupplierComparisonResponse> compareSuppliersByProduct(String productId);

}
