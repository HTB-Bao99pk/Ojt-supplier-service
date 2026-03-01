package com.group4.supplier_service.controller;

import com.group4.supplier_service.dto.ApiResponse;
import com.group4.supplier_service.dto.SupplierCreateRequest;
import com.group4.supplier_service.dto.SupplierResponse;
import com.group4.supplier_service.dto.SupplierUpdateRequest;
import com.group4.supplier_service.service.SupplierService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierController {

    SupplierService supplierService;

    @GetMapping
    public ApiResponse<Page<SupplierResponse>> getAllSuppliers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<SupplierResponse>>builder()
                .message("Get supplier list successfully")
                .result(supplierService.getAllSuppliers(page, size))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<SupplierResponse> updateSupplier(
            @PathVariable String id,
            @RequestBody SupplierUpdateRequest dto,
            @RequestHeader("USER") String user
    ) {
        return ApiResponse.<SupplierResponse>builder()
                .message("Update supplier successfully")
                .result(supplierService.updateSupplier(id, dto, user))
                .build();
    }

    @PatchMapping("/{id}/toggle-suspend")
    public ApiResponse<SupplierResponse> toggleSuspend(
            @PathVariable String id,
            @RequestHeader("USER") String user
    ) {
        return ApiResponse.<SupplierResponse>builder()
                .message("Toggle supplier status successfully")
                .result(supplierService.toggleSuspend(id, user))
                .build();
    }

    @PostMapping
    public ApiResponse<SupplierResponse> createSupplier(
            @RequestBody @Valid SupplierCreateRequest dto,
            @RequestHeader("USER") String user
    ) {
        return ApiResponse.<SupplierResponse>builder()
                .message("Create supplier successfully")
                .result(supplierService.createSupplier(dto, user))
                .build();
    }
}