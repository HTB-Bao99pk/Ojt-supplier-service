package com.group4.supplier_service.controller;

import com.group4.supplier_service.dto.ApiResponse;
import com.group4.supplier_service.dto.ProductResponse;
import com.group4.supplier_service.service.SupplierProductService;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class SupplierProductController {
    SupplierProductService supplierProductService;


    @GetMapping("/{supplierId}/products")
    public ApiResponse<Page<ProductResponse>> getProductBySupplierId(@PathVariable  String supplierId, @RequestParam(defaultValue = "0" )  int page, @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<Page<ProductResponse>>builder()
                .message("Get products by supplier id successfully")
                .result(supplierProductService.getProductBySupplierId(supplierId, page, size))
                .build();
    }

}
