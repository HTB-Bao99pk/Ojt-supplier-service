package com.group4.supplier_service.service.impl;

import com.group4.supplier_service.dto.SupplierUpdateRequest;
import com.group4.supplier_service.entity.Supplier;
import com.group4.supplier_service.entity.SupplierAuditLog;
import com.group4.supplier_service.enums.AuditAction;
import com.group4.supplier_service.repository.SupplierAuditLogRepository;
import com.group4.supplier_service.repository.SupplierRepository;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;

public class SupplierServiceImpl {
    SupplierRepository supplierRepository;
    SupplierAuditLogRepository auditLogRepository;
    ObjectMapper objectMapper;

    public Supplier update(String supplierId, SupplierUpdateRequest dto, String updatedBy){
        Supplier supplier = supplierRepository.findById(supplierId).orElseThrow(() -> new RuntimeException("Supplier not found"));

        Supplier oldData = cloneSupplier(supplier);

        if(dto.name() != null) supplier.setName(dto.name());
        if(dto.contactEmail() != null) supplier.setContactEmail(dto.contactEmail());
        if(dto.phone() != null) supplier.setPhone(dto.phone());
        if(dto.address() != null) supplier.setAddress(dto.address());
        if(dto.region() != null) supplier.setRegion(dto.region());
        supplier.setUpdateBy(updatedBy);
        supplier.setUpdateAt(LocalDateTime.now());
        Supplier newData = supplierRepository.save(supplier);

        AuditUpdate(newData, oldData, newData, updatedBy);
        return newData;
    }

    private void AuditUpdate(Supplier supplier, Supplier oldData, Supplier newData, String updatedBy){
        SupplierAuditLog auditLog = SupplierAuditLog.builder()
                .supplier(supplier)
                .action(AuditAction.UPDATE)
                .oldData(objectMapper.writeValueAsString(oldData))
                .newData(objectMapper.writeValueAsString(newData))
                .performedBy(updatedBy)
                .performedAt(LocalDateTime.now())
                .build();

        auditLogRepository.save(auditLog);
    }

    private Supplier cloneSupplier(Supplier supplier){
        return Supplier.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .contactEmail(supplier.getContactEmail())
                .phone(supplier.getPhone())
                .address(supplier.getAddress())
                .region(supplier.getRegion())
                .status(supplier.getStatus())
                .rating(supplier.getRating())
                .approvedBy(supplier.getApprovedBy())
                .approvedAt(supplier.getApprovedAt())
                .createBy(supplier.getCreateBy())
                .createAt(supplier.getCreateAt())
                .updateBy(supplier.getUpdateBy())
                .updateAt(supplier.getUpdateAt())
                .build();
    }
}
