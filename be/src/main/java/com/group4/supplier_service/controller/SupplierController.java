package com.group4.supplier_service.controller;

import com.group4.supplier_service.dto.response.ApiResponse;
import com.group4.supplier_service.dto.request.SupplierCreateRequest;
import com.group4.supplier_service.dto.response.SupplierResponse;
import com.group4.supplier_service.dto.request.SupplierUpdateRequest;
import com.group4.supplier_service.enums.SupplierStatus;
import com.group4.supplier_service.service.SupplierService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/suppliers")
@CrossOrigin(origins = "http://localhost:5173")
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

    @GetMapping("/search")
    public ApiResponse<Page<SupplierResponse>> getSuppliersByNameOrEmailOrPhone(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<SupplierResponse>>builder()
                .message("Get supplier list successfully")
                .result(supplierService.getSuppliersByNameOrEmailOrPhone(keyword, page, size))
                .build();
    }

    @GetMapping("/filter")
    public ApiResponse<Page<SupplierResponse>> filterSuppliers(
            @RequestParam(required = false) SupplierStatus status,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) BigDecimal minRating,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime updatedAfter,

            @PageableDefault(size = 10)
            @SortDefault(sort = "updateAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {

        return ApiResponse.<Page<SupplierResponse>>builder()
                .message("Filter suppliers successfully")
                .result(
                        supplierService.filterSuppliers(
                                status, region, minRating,
                                updatedAfter, pageable))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<SupplierResponse> getSupplierById(@PathVariable String id) {
        return ApiResponse.<SupplierResponse>builder()
                .message("Get supplier successfully")
                .result(supplierService.getSupplierById(id))
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

    @PutMapping("/{id}/approve")
    public ApiResponse<SupplierResponse> approveSupplier(
            @PathVariable String id,
            @RequestHeader("USER") String user
    ) {
        return ApiResponse.<SupplierResponse>builder()
                .message("Approve supplier successfully")
                .result(supplierService.approveSupplier(id, user))
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
    @GetMapping("/approved")
    public ApiResponse<Page<SupplierResponse>> viewApprovedSuppliers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<SupplierResponse>>builder()
                .message("view approved suppliers")
                .result(supplierService.getApprovedSuppliers(page, size))
                .build();
    }
}