package com.group4.supplier_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    String id;
    String productId;
    String supplierId;
    BigDecimal price;
    Integer deliveryDateTimes;
    Boolean isActive;
    LocalDateTime createAt;
    LocalDateTime updateAt;
}
