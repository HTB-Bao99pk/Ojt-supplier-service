package com.group4.supplier_service.specification;

import com.group4.supplier_service.entity.Supplier;
import com.group4.supplier_service.enums.SupplierStatus;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SupplierSpecification {

    public static Specification<Supplier> filter(
            SupplierStatus status,
            String region,
            BigDecimal minRating,
            LocalDateTime updatedAfter
    ) {
        return (root, query, cb) -> {

            var predicate = cb.conjunction();

            if (status != null) {
                predicate = cb.and(predicate,
                        cb.equal(root.get("status"), status));
            }

            if (region != null && !region.isBlank()) {
                predicate = cb.and(predicate,
                        cb.equal(cb.lower(root.get("region")),
                                region.toLowerCase()));
            }

            if (minRating != null) {
                predicate = cb.and(predicate,
                        cb.greaterThanOrEqualTo(
                                root.get("rating"), minRating));
            }

            if (updatedAfter != null) {
                predicate = cb.and(predicate,
                        cb.greaterThanOrEqualTo(
                                root.get("updateAt"), updatedAfter));
            }

            return predicate;
        };
    }
}