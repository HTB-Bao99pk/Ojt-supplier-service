package com.group4.supplier_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SupplierCreateRequest(
        @NotBlank(message = "Supplier name must not be blank")
        String name,

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email must not be blank")
        String contactEmail,

        @NotBlank(message = "Phone number must not be blank")
        String phone,

        @NotBlank(message = "Address must not be blank")
        String address,

        @NotBlank(message = "Region must not be blank")
        String region
) {
}
