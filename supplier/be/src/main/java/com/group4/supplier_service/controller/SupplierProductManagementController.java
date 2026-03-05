package com.group4.supplier_service.controller;

import com.group4.supplier_service.dto.request.SupplierProductFilterRequest;
import com.group4.supplier_service.dto.response.ApiResponse;
import com.group4.supplier_service.dto.response.ProductResponse;
import com.group4.supplier_service.service.SupplierProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/supplier-products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierProductManagementController {
    SupplierProductService supplierProductService;

    @GetMapping
    public ApiResponse<Page<ProductResponse>> searchSupplierProducts(
            @RequestParam(required = false) String productId,
            @RequestParam(required = false) String supplierId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer deliveryDateTimes,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createTo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime updateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime updateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        SupplierProductFilterRequest filter = SupplierProductFilterRequest.builder()
                .productId(productId)
                .supplierId(supplierId)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .deliveryDateTimes(deliveryDateTimes)
                .isActive(isActive)
                .createFrom(createFrom)
                .createTo(createTo)
                .updateFrom(updateFrom)
                .updateTo(updateTo)
                .build();

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProductResponse> result = supplierProductService.getSupplierProducts(filter, pageable);
        return ApiResponse.<Page<ProductResponse>>builder()
                .message("Search supplier products successfully")
                .result(result)
                .build();
    }
}
