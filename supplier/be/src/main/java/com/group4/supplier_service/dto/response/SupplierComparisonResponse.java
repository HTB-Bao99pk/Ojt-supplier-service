package com.group4.supplier_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupplierComparisonResponse {
    String supplierId;
    String supplierName;
    BigDecimal overallRating;
    String productId;
    BigDecimal price;
    Integer deliveryDateTimes;
    Double recommendationScore;
}
