package com.group4.supplier_service.controller;

import com.group4.supplier_service.dto.request.SupplierProductFilterRequest;
import com.group4.supplier_service.dto.request.SupplierProductUpdateRequest;
import com.group4.supplier_service.dto.request.SupplierProductCreateRequest;
import com.group4.supplier_service.dto.response.ApiResponse;
import com.group4.supplier_service.dto.response.ProductResponse;
import com.group4.supplier_service.dto.response.SupplierComparisonResponse;
import com.group4.supplier_service.service.SupplierProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierProductController {
    SupplierProductService supplierProductService;

    @GetMapping("/{supplierId}/products")
    public ApiResponse<Page<ProductResponse>> getProductBySupplierId(@PathVariable String supplierId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<Page<ProductResponse>>builder()
                .message("Get products by supplier id successfully")
                .result(supplierProductService.getProductBySupplierId(supplierId, page, size))
                .build();
    }

    @PostMapping("/{supplierId}/products")
    public ApiResponse<ProductResponse> createSupplierProduct(
            @PathVariable String supplierId,
            @RequestBody @Valid SupplierProductCreateRequest request
    ) {
        return ApiResponse.<ProductResponse>builder()
                .message("Create supplier product successfully")
                .result(supplierProductService.createSupplierProduct(supplierId, request))
                .build();
    }

    @GetMapping("/products/{productId}/compare")
    public ApiResponse<List<SupplierComparisonResponse>> compareSuppliers(@PathVariable String productId) {
        return ApiResponse.<List<SupplierComparisonResponse>>builder()
                .message("Ranked supplier recommendation list generated successfully")
                .result(supplierProductService.compareSuppliersByProduct(productId))
                .build();
    }

    @PatchMapping("/{supplierId}/products/{productId}")
    public ApiResponse<ProductResponse> updateSupplierProduct(@PathVariable String productId, @PathVariable String supplierId, @RequestBody @Valid SupplierProductUpdateRequest request){
        return ApiResponse.<ProductResponse>builder()
                .message("Update supplier product successfully")
                .result(supplierProductService.updateSupplierProduct(productId, supplierId, request ))
                .build();
    }

    @GetMapping("/products/search")
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

        return ApiResponse.<Page<ProductResponse>>builder()
                .message("Search supplier products successfully")
                .result(supplierProductService.getSupplierProducts(filter, pageable))
                .build();
    }

}
