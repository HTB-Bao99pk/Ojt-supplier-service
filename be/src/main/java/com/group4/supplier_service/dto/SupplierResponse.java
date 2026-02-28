package com.group4.supplier_service.dto;

import com.group4.supplier_service.enums.SupplierStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupplierResponse {

    private String id;

    private String name;

    private String contactEmail;

    private String phone;

    private String address;

    private String region;

    private SupplierStatus status;

    private BigDecimal rating;

    private String approvedBy;

    private LocalDateTime approvedAt;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;
}