package com.group4.supplier_service.dto.request;

public record SupplierUpdateRequest(
        String name,
        String contactEmail,
        String phone,
        String address,
        String region,
        String materialType,
        String taxCode
) { }
