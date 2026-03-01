package com.group4.supplier_service.entity;

import com.group4.supplier_service.enums.SupplierStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "suppliers")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false, unique = true)
    String name;

    @Email
    @Column(name = "contact_email", unique = true)
    String contactEmail;

    String phone;

    @Column(columnDefinition = "TEXT")
    String address;

    String region;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    SupplierStatus status = SupplierStatus.PENDING;

    @Column(precision = 3, scale = 2)
    BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "approved_by")
    String approvedBy;

    @Column(name = "approved_at")
    LocalDateTime approvedAt;

    @Column(name = "create_by", nullable = false)
    String createBy;

    @Column(name = "create_at")
    @CreationTimestamp
    LocalDateTime createAt;

    @Column(name = "update_by")
    String updateBy;

    @Column(name = "update_at")
    @UpdateTimestamp
    LocalDateTime updateAt;






}
