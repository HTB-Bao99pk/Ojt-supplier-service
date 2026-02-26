package com.group4.supplier_service.entity;

import com.group4.supplier_service.enums.AuditAction;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "supplier_audit_logs")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupplierAuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    Supplier supplier;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    AuditAction action = AuditAction.APPROVE;

    @Column(name = "old_data", columnDefinition = "TEXT")
    String oldData;

    @Column(name = "new_data", columnDefinition = "TEXT")
    String newData;

    @Column(name = "performed_by", nullable = false)
    String performedBy;

    @Column(name = "performed_at", updatable = false)
    @CreationTimestamp
    LocalDateTime performedAt;
}
