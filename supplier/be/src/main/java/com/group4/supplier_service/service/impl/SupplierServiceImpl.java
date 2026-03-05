package com.group4.supplier_service.service.impl;

import com.group4.supplier_service.dto.request.SupplierCreateRequest;
import com.group4.supplier_service.dto.request.SupplierUpdateRequest;
import com.group4.supplier_service.dto.response.SupplierResponse;
import com.group4.supplier_service.entity.Supplier;
import com.group4.supplier_service.entity.SupplierAuditLog;
import com.group4.supplier_service.enums.AuditAction;
import com.group4.supplier_service.enums.SupplierStatus;
import com.group4.supplier_service.exception.AppException;
import com.group4.supplier_service.exception.ErrorCode;
import com.group4.supplier_service.repository.SupplierAuditLogRepository;
import com.group4.supplier_service.repository.SupplierRepository;
import com.group4.supplier_service.service.SupplierService;
import com.group4.supplier_service.specification.SupplierSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierAuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

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
        if (dto.materialType() != null) supplier.setMaterialType(dto.materialType());

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
    public SupplierResponse getSupplierById(String supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_FOUND));

        return mapToResponse(supplier);
    }
    @Override
    public Page<SupplierResponse> getApprovedSuppliers(int page, int size) {
        return supplierRepository
                .findByStatus(SupplierStatus.APPROVED, PageRequest.of(page, size))
                .map(this::mapToResponse);
    }

    @Override
    public Page<SupplierAuditLog> getAuditLogsBySupplierId(String supplierId, int page, int size) {
        return auditLogRepository.findBySupplierIdOrderByPerformedAtDesc(
                supplierId, PageRequest.of(page, size));
    }

    @Override
    public SupplierResponse createSupplier(SupplierCreateRequest dto, String createdBy) {

        validateBusinessRule(dto);

        Supplier supplier = Supplier.builder()
                .name(dto.name().trim())
                .contactEmail(dto.contactEmail().trim().toLowerCase())
                .phone(dto.phone())
                .address(dto.address())
                .region(dto.region())
                .taxCode(dto.taxCode())
                .materialType(dto.materialType())
                .createBy(createdBy)
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
    private void validateBusinessRule(SupplierCreateRequest dto) {

        Map<String, String> errors = new HashMap<>();

        if (supplierRepository.existsByContactEmail(dto.contactEmail().trim())) {
            errors.put("contactEmail", "Contact email is already in use");
        }

        if (supplierRepository.existsByTaxCode(dto.taxCode().trim())) {
            errors.put("taxCode", "Tax code is already in use");
        }

        if (supplierRepository.existsByName(dto.name().trim())) {
            errors.put("name", "Supplier name is already in use");
        }
        if (supplierRepository.existsByPhone(dto.phone().trim())) {
            errors.put("phone", "Phone number is already in use");
        }

        if (!errors.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_INPUT, errors);
        }
    }

    @Override
    public SupplierResponse reviewSupplier(String supplierId, SupplierStatus status, String reason, String reviewedBy) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_FOUND));

        Supplier oldData = cloneSupplier(supplier);

        supplier.setStatus(status);
        if (status == SupplierStatus.REJECTED) {
            supplier.setRejectionReason(reason);
        }
        supplier.setApprovedBy(reviewedBy);
        supplier.setApprovedAt(LocalDateTime.now());
        supplier.setUpdateBy(reviewedBy);

        Supplier saved = supplierRepository.save(supplier);

        AuditAction action;
        if (status == SupplierStatus.APPROVED || status == SupplierStatus.SUSPENDED) {
            action = AuditAction.APPROVE;
        } else if (status == SupplierStatus.REJECTED) {
            action = AuditAction.REJECT;
        } else {
            action = AuditAction.UPDATE;
        }

        auditLog(saved, oldData, saved, reviewedBy, action);

        return mapToResponse(saved);
    }

    @Override
    public Page<SupplierResponse> getSuppliersByNameOrEmailOrPhone(String keyword, int page, int size) {

        String kw = (keyword == null) ? "" : keyword;

        return supplierRepository
                .findByNameContainingIgnoreCaseOrContactEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                        kw, kw, kw, PageRequest.of(page, size)
                )
                .map(this::mapToResponse);
    }

    @Override
    public Page<SupplierResponse> filterSuppliers(
            SupplierStatus status,
            String region,
            BigDecimal minRating,
            LocalDateTime updatedAfter,
            Pageable pageable
    ) {

        Specification<Supplier> spec =
                SupplierSpecification.filter(status, region, minRating, updatedAfter);

        return supplierRepository.findAll(spec, pageable)
                .map(this::mapToResponse);
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }

    private void saveAuditLog(Supplier supplier, AuditAction action, String performedBy) {
        SupplierAuditLog auditLog = SupplierAuditLog.builder()
                .supplier(supplier)
                .action(action)
                .oldData(null)
                .newData(toJson(supplier))
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
                .materialType(supplier.getMaterialType())
                .taxCode(supplier.getTaxCode())
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
                .materialType(supplier.getMaterialType())
                .taxCode(supplier.getTaxCode())
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

    private void auditLog(Supplier supplier, Supplier oldData, Supplier newData, String updatedBy, AuditAction action) {
        String oldDataJson = (oldData != null) ? toJson(oldData) : null;
        String newDataJson = (newData != null) ? toJson(newData) : null;

        SupplierAuditLog auditLog = SupplierAuditLog.builder()
                .supplier(supplier)
                .action(action)
                .oldData(oldDataJson)
                .newData(newDataJson)
                .performedBy(updatedBy)
                .performedAt(LocalDateTime.now())
                .build();

        auditLogRepository.save(auditLog);
    }
}