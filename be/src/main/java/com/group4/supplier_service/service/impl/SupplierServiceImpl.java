package com.group4.supplier_service.service.impl;

import com.group4.supplier_service.dto.SupplierCreateRequest;
import com.group4.supplier_service.dto.SupplierResponse;
import com.group4.supplier_service.dto.SupplierUpdateRequest;
import com.group4.supplier_service.entity.Supplier;
import com.group4.supplier_service.entity.SupplierAuditLog;
import com.group4.supplier_service.enums.AuditAction;
import com.group4.supplier_service.enums.SupplierStatus;
import com.group4.supplier_service.exception.AppException;
import com.group4.supplier_service.exception.ErrorCode;
import com.group4.supplier_service.repository.SupplierAuditLogRepository;
import com.group4.supplier_service.repository.SupplierRepository;
import com.group4.supplier_service.service.SupplierService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierAuditLogRepository auditLogRepository;

    @Override
    public SupplierResponse updateSupplier(String supplierId, SupplierUpdateRequest dto, String updatedBy) {

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Supplier oldData = cloneSupplier(supplier);

        if (dto.name() != null) supplier.setName(dto.name());
        if (dto.contactEmail() != null) supplier.setContactEmail(dto.contactEmail());
        if (dto.phone() != null) supplier.setPhone(dto.phone());
        if (dto.address() != null) supplier.setAddress(dto.address());
        if (dto.region() != null) supplier.setRegion(dto.region());

        supplier.setUpdateBy(updatedBy);

        Supplier saved = supplierRepository.save(supplier);

        auditLog(saved, oldData, saved, updatedBy, AuditAction.UPDATE);

        return mapToResponse(saved);
    }

    @Override
    public SupplierResponse toggleSuspend(String supplierId, String updatedBy) {

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Supplier oldData = cloneSupplier(supplier);

        boolean isSuspended = supplier.getStatus() == SupplierStatus.SUSPENDED;

        supplier.setStatus(isSuspended ? SupplierStatus.APPROVED : SupplierStatus.SUSPENDED);
        supplier.setUpdateBy(updatedBy);

        Supplier saved = supplierRepository.save(supplier);

        auditLog(saved, oldData, saved, updatedBy,
                isSuspended ? AuditAction.APPROVE : AuditAction.SUSPEND);

        return mapToResponse(saved);
    }

    @Override
    public Page<SupplierResponse> getAllSuppliers(int page, int size) {

        return supplierRepository.findAll(PageRequest.of(page, size))
                .map(this::mapToResponse);
    }

    @Override
    public SupplierResponse createSupplier(SupplierCreateRequest dto, String createdBy) {

        if (supplierRepository.existsByContactEmail(dto.contactEmail().trim().toLowerCase())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_USED);
        }

        Supplier supplier = Supplier.builder()
                .name(dto.name().trim())
                .contactEmail(dto.contactEmail().trim().toLowerCase())
                .phone(dto.phone())
                .address(dto.address())
                .region(dto.region())
                .createBy(createdBy)
                .taxCode(dto.taxCode())
                .materialType(dto.materialType())
                .status(SupplierStatus.PENDING)
                .rating(BigDecimal.ZERO)
                .build();

        try {
            Supplier saved = supplierRepository.save(supplier);
            saveAuditLog(saved, AuditAction.CREATE, createdBy);
            return mapToResponse(saved);

        } catch (DataIntegrityViolationException ex) {

            if (ex.getMessage().contains("contact_email")) {
                throw new AppException(ErrorCode.EMAIL_ALREADY_USED);
            }

            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    private void saveAuditLog(Supplier supplier, AuditAction action, String performedBy) {
        SupplierAuditLog auditLog = SupplierAuditLog.builder()
                .supplier(supplier)
                .action(action)
                .newData("Name: " + supplier.getName() + ", Email: " + supplier.getContactEmail())
                .performedBy(performedBy)
                .performedAt(LocalDateTime.now())
                .build();
        auditLogRepository.save(auditLog);
    }

    private SupplierResponse mapToResponse(Supplier supplier) {
        return SupplierResponse.builder()
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
                .createAt(supplier.getCreateAt())
                .updateAt(supplier.getUpdateAt())
                .build();
    }

    private Supplier cloneSupplier(Supplier supplier) {
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

    private void auditLog(Supplier supplier, Supplier oldData,
                          Supplier newData, String updatedBy, AuditAction action) {

        SupplierAuditLog auditLog = SupplierAuditLog.builder()
                .supplier(supplier)
                .action(action)
                .oldData("name=" + oldData.getName() + ", email=" + oldData.getContactEmail() +
                        ", phone=" + oldData.getPhone() + ", address=" + oldData.getAddress() +
                        ", region=" + oldData.getRegion())
                .newData("name=" + newData.getName() + ", email=" + newData.getContactEmail() +
                        ", phone=" + newData.getPhone() + ", address=" + newData.getAddress() +
                        ", region=" + newData.getRegion())
                .performedBy(updatedBy)
                .performedAt(LocalDateTime.now())
                .build();

        auditLogRepository.save(auditLog);
    }
}