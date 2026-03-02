package com.group4.supplier_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SupplierCreateRequest(
        @NotBlank(message = "Supplier name must not be blank")
        String name,

        @Email(message = "Invalid email format")
        @NotBlank(message = "Contact email must not be blank")
        String contactEmail,

        @NotBlank(message = "Tax code must not be blank")
        String taxCode,

        @NotBlank(message = "Material type must not be blank")
        String materialType,

        @NotBlank(message = "Phone number must not be blank")
        String phone,

        @NotBlank(message = "Address must not be blank")
        String address,

        @NotBlank(message = "Region must not be blank")
        String region
) {
}
