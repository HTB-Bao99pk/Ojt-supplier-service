package com.group4.supplier_service.controller;

import com.group4.supplier_service.dto.ApiResponse;
import com.group4.supplier_service.dto.SupplierResponse;
import com.group4.supplier_service.service.SupplierService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/franchise/suppliers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FranchiseSupplierController {

    SupplierService supplierService;

    @GetMapping
    public ApiResponse<Page<SupplierResponse>> viewApprovedSuppliers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<SupplierResponse>>builder()
                .message("Franchise view approved suppliers")
                .result(supplierService.getApprovedSuppliersForFranchise(page, size))
                .build();
    }
}