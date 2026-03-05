package com.group4.shift_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "shift_assignments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"shift_id", "staff_id"})
)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShiftAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "shift_id", nullable = false)
    String shiftId;

    @Column(name = "staff_id", nullable = false)
    String staffId;

    @Column(name = "assigned_by", nullable = false)
    String assignedBy;

    @Column(name = "assigned_at")
    @CreationTimestamp
    LocalDateTime assignedAt;
}