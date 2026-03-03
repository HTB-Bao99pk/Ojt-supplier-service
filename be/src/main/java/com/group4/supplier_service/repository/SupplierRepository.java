package com.group4.supplier_service.repository;

import com.group4.supplier_service.entity.Supplier;
import com.group4.supplier_service.entity.SupplierProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, String>, JpaSpecificationExecutor<Supplier> {
    boolean existsByContactEmail(String contactEmail);
}
