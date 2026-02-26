package com.group4.supplier_service.repository;

import com.group4.supplier_service.entity.SupplierProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierProductRepository extends JpaRepository<SupplierProduct, String> {
    Page<SupplierProduct> findBySupplierId(String supplierId, Pageable pageable);
}
