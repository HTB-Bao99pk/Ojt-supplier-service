package com.group4.supplier_service.repository;

import com.group4.supplier_service.entity.SupplierProduct;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierProductRepository extends JpaRepository<SupplierProduct, String> {
    Page<SupplierProduct> findBySupplierId(String supplierId, Pageable pageable);

    List<SupplierProduct> findByProductIdAndIsActiveTrue(String productId);

    boolean existsBySupplierIdAndProductId(String supplierId, String productId);

    Optional<SupplierProduct> findBySupplierIdAndProductId(String supplierId, String productId );
}
