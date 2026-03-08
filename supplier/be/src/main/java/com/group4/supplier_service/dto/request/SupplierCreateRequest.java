package com.group4.supplier_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SupplierCreateRequest(
        @NotBlank(message = "SUPPLIER_NAME_NOT_BLANK")
        String name,

        @Email(message = "INVALID_EMAIL_FORMAT")
        @NotBlank(message = "CONTACT_EMAIL_NOT_BLANK")
        String contactEmail,

        @NotBlank(message = "TAX_CODE_NOT_BLANK")
        String taxCode,

        @NotBlank(message = "MATERIALS_NOT_BLANK")
        String materialType,

        @NotBlank(message = "PHONE_NOT_BLANK")
        @Pattern(regexp = "^0[35789][0-9]{8}$", message = "INVALID_PHONE_FORMAT")
        String phone,

        @NotBlank(message = "ADDRESS_NOT_BLANK")
        String address,

        @NotBlank(message = "REGION_NOT_BLANK")
        String region
) {
}
