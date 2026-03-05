package com.group4.supplier_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SupplierProductFilterRequest {
    String productId;
    String supplierId;
    BigDecimal minPrice;
    BigDecimal maxPrice;
    Integer deliveryDateTimes;
    Boolean isActive;
    LocalDateTime createFrom;
    LocalDateTime createTo;
    LocalDateTime updateFrom;
    LocalDateTime updateTo;
    Integer page = 0;
    Integer size = 10;
    String sortBy;
    String sortDir;
}
