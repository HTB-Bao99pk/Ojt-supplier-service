package com.group4.supplier_service.specification;

import com.group4.supplier_service.dto.request.SupplierProductFilterRequest;
import com.group4.supplier_service.entity.SupplierProduct;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class SupplierProductSpecification {

    public static Specification<SupplierProduct> fromFilter(SupplierProductFilterRequest f) {
        return (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> preds = new ArrayList<>();

            if (f.getSupplierId() != null) {
                Join<Object, Object> supplierJoin = root.join("supplier", JoinType.INNER);
                preds.add(cb.equal(supplierJoin.get("id"), f.getSupplierId()));
            }

            if (f.getProductId() != null) {
                preds.add(cb.equal(root.get("productId"), f.getProductId()));
            }

            if (f.getMinPrice() != null) {
                preds.add(cb.greaterThanOrEqualTo(root.get("price"), f.getMinPrice()));
            }

            if (f.getMaxPrice() != null) {
                preds.add(cb.lessThanOrEqualTo(root.get("price"), f.getMaxPrice()));
            }

            if (f.getDeliveryDateTimes() != null) {
                preds.add(cb.equal(root.get("deliveryDateTimes"), f.getDeliveryDateTimes()));
            }

            if (f.getIsActive() != null) {
                preds.add(cb.equal(root.get("isActive"), f.getIsActive()));
            }

            if (f.getCreateFrom() != null) {
                preds.add(cb.greaterThanOrEqualTo(root.get("createAt"), f.getCreateFrom()));
            }

            if (f.getCreateTo() != null) {
                preds.add(cb.lessThanOrEqualTo(root.get("createAt"), f.getCreateTo()));
            }

            if (f.getUpdateFrom() != null) {
                preds.add(cb.greaterThanOrEqualTo(root.get("updateAt"), f.getUpdateFrom()));
            }

            if (f.getUpdateTo() != null) {
                preds.add(cb.lessThanOrEqualTo(root.get("updateAt"), f.getUpdateTo()));
            }

            return cb.and(preds.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}
