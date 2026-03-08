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

    @NotBlank(message = "PRODUCT_ID_NOT_BLANK")
    String productId;

    @NotNull(message = "PRICE_NOT_NULL")
    @DecimalMin(value = "0.0", inclusive = true, message = "PRICE_MUST_BE_POSITIVE")
    BigDecimal price;

    @NotNull(message = "DELIVERY_TIME_NOT_NULL")
    @Min(value = 1, message = "DELIVERY_TIME_MUST_BE_AT_LEAST_1")
    Integer deliveryDateTimes;
}
