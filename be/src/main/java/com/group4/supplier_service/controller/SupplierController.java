package com.group4.supplier_service.controller;

import com.group4.supplier_service.dto.SupplierUpdateRequest;
import com.group4.supplier_service.entity.Supplier;
import com.group4.supplier_service.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;

    @PutMapping("/{id}")
    public Supplier updateSupplier(
            @PathVariable String id,
            @RequestBody SupplierUpdateRequest dto,
            @RequestHeader("USER") String user
    ) {
        return supplierService.updateSupplier(id, dto, user);
    }

    @PatchMapping("/{id}/toggle-suspend")
    public Supplier toggleSuspend(
            @PathVariable String id,
            @RequestHeader("USER") String user
    ) {
        return supplierService.toggleSuspend(id, user);
    }
}
