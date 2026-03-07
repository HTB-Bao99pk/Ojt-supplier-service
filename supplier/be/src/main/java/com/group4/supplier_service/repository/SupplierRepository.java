package com.group4.supplier_service.repository;

import com.group4.supplier_service.entity.Supplier;
import com.group4.supplier_service.entity.SupplierProduct;
import com.group4.supplier_service.enums.SupplierStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, String>, JpaSpecificationExecutor<Supplier> {
    boolean existsByContactEmail(String contactEmail);

    boolean existsByTaxCode(String taxCode);
    boolean existsByName(String supplierName);
    boolean existsByPhone(String supplierName);

    Page<Supplier> findByNameContainingIgnoreCaseOrContactEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(String name, String contactEmail, String phone, Pageable pageable);

    Page<Supplier> findByStatus(SupplierStatus status, Pageable pageable);

    Page<Supplier> findByStatusNot(SupplierStatus status, Pageable pageable);
}
