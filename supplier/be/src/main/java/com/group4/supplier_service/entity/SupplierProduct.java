package com.group4.supplier_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "supplier_products", uniqueConstraints = {@UniqueConstraint(columnNames = {"supplier_id", "product_id"})
})
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupplierProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    Supplier supplier;

    @Column(name = "product_id", nullable = false)
    String productId;


    @Column(precision = 15, scale = 2, nullable = false)
    BigDecimal price;

    @Column(name = "delivery_date_times", nullable = false)
    Integer deliveryDateTimes;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    Boolean isActive = true;

    @Column(name = "create_by", nullable = false, updatable = false)
    String createBy;

    @CreationTimestamp
    @Column(name = "create_at", nullable= false, updatable = false)
    LocalDateTime createAt;

    @Column(name = "update_by")
    String updateBy;

    @UpdateTimestamp
    @Column(name = "update_at")
    LocalDateTime updateAt;

    @Column(name = "deleted_at")
    LocalDateTime deletedAt;



}
