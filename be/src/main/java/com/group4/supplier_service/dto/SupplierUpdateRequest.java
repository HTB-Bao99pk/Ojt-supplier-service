package com.group4.supplier_service.dto;

public record SupplierUpdateRequest(
        String name,
        String contactEmail,
        String phone,
        String address,
        String region
) { }
