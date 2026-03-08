package com.group4.supplier_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

public record SupplierUpdateRequest(
        String name,

        @Email(message = "INVALID_EMAIL_FORMAT")
        String contactEmail,

        @Pattern(regexp = "^0[35789][0-9]{8}$", message = "INVALID_PHONE_FORMAT")
        String phone,

        String address,
        String region,
        String materialType,
        String taxCode
) { }
