package com.group4.supplier_service.controller;

<<<<<<< HEAD
import com.group4.supplier_service.dto.request.SupplierProductUpdateRequest;
=======
import com.group4.supplier_service.dto.request.SupplierProductCreateRequest;
>>>>>>> deed7af1423cf3ec9a05c1aae5bacf2faf65e356
import com.group4.supplier_service.dto.response.ApiResponse;
import com.group4.supplier_service.dto.response.ProductResponse;
import com.group4.supplier_service.dto.response.SupplierComparisonResponse;
import com.group4.supplier_service.service.SupplierProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

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

}
