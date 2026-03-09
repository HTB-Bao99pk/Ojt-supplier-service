package com.group4.supplier_service.repository;

import com.group4.supplier_service.entity.SupplierProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierProductRepository extends JpaRepository<SupplierProduct, String>, JpaSpecificationExecutor<SupplierProduct> {
    Page<SupplierProduct> findBySupplierId(String supplierId, Pageable pageable);

    List<SupplierProduct> findByProductIdAndIsActiveTrue(String productId);

    boolean existsBySupplierIdAndProductId(String supplierId, String productId);

    Optional<SupplierProduct> findBySupplierIdAndProductId(String supplierId, String productId );

    @Modifying
    @Query("UPDATE SupplierProduct sp SET sp.isActive = false WHERE sp.supplier.id = :supplierId")
    void disableAllProductsBySupplierId(@Param("supplierId") String supplierId);

    long countByIsActiveTrue();

}
