package com.group4.supplier_service.controller;

import com.group4.supplier_service.dto.SupplierUpdateRequest;
import com.group4.supplier_service.entity.Supplier;
import com.group4.supplier_service.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    SupplierService supplierService;

    @PutMapping("/{id}")
    public Supplier updateSupplier(
            @PathVariable String id,
            @RequestBody SupplierUpdateRequest dto,
            @RequestHeader("X-USER") String user
    ) {
        return supplierService.update(id, dto, user);
    }
}
