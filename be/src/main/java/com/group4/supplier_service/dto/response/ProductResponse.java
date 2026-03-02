package com.group4.supplier_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    String productId;
    BigDecimal price;
    Integer deliveryDateTimes;
    Boolean isActive;
}
