package com.group4.supplier_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupplierProductCreateRequest {

    @NotBlank(message = "Product ID must not be blank")
    String productId;

    @NotNull(message = "Price must not be null")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
    @DecimalMax(value = "999999999.99", inclusive = true, message = "Price must be less than 999999999.99")
    BigDecimal price;

    @NotNull(message = "Delivery date times must not be null")
    @Min(value = 1, message = "Delivery date times must be at least 1")
    @Max(value = 365, message = "Delivery date times must be at most 365")
    Integer deliveryDateTimes;
}
