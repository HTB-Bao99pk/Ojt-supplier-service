package com.group4.supplier_service.dto.request;

import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupplierProductUpdateRequest {
    @Min(value = 0, message = "PRICE_MUST_BE_POSITIVE")
    BigDecimal price;

    @Min(value = 0, message = "DELIVERY_TIME_MUST_BE_POSITIVE")
    Integer deliveryDateTimes;

    Boolean isActive;
}
