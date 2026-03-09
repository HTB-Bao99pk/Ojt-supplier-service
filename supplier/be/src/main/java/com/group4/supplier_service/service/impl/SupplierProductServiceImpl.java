package com.group4.supplier_service.service.impl;

import com.group4.supplier_service.dto.request.SupplierProductUpdateRequest;
import com.group4.supplier_service.dto.request.SupplierProductCreateRequest;
import com.group4.supplier_service.dto.request.SupplierProductFilterRequest;
import com.group4.supplier_service.dto.response.ProductResponse;
import com.group4.supplier_service.dto.response.SupplierComparisonResponse;
import com.group4.supplier_service.entity.Supplier;
import com.group4.supplier_service.entity.SupplierAuditLog;
import com.group4.supplier_service.entity.SupplierProduct;
import com.group4.supplier_service.enums.AuditAction;
import com.group4.supplier_service.enums.SupplierStatus;
import com.group4.supplier_service.exception.AppException;
import com.group4.supplier_service.exception.ErrorCode;
import com.group4.supplier_service.repository.SupplierAuditLogRepository;
import com.group4.supplier_service.repository.SupplierProductRepository;
import com.group4.supplier_service.repository.SupplierRepository;
import com.group4.supplier_service.service.SupplierProductService;
import com.group4.supplier_service.specification.SupplierProductSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierProductServiceImpl implements SupplierProductService {
    SupplierRepository supplierRepository;
    SupplierProductRepository supplierProductRepository;
    ModelMapper modelMapper;
    SupplierAuditLogRepository auditLogRepository;
    tools.jackson.databind.ObjectMapper objectMapper;

    @Override
    public Page<ProductResponse> getSupplierProducts(SupplierProductFilterRequest request, Pageable pageable) {
        // Build specification
        var spec = SupplierProductSpecification.fromFilter(request);

        // Apply sorting if pageable has none but request contains sort info - caller should set pageable normally
        Pageable pageToUse = pageable;
        Page<SupplierProduct> page = supplierProductRepository.findAll(spec, pageToUse);
        return page.map(this::mapToProductResponseWithSupplier);
    }

    private ProductResponse mapToProductResponseWithSupplier(SupplierProduct product) {
        ProductResponse.ProductResponseBuilder builder = ProductResponse.builder()
                .id(product.getId())
                .productId(product.getProductId())
                .price(product.getPrice())
                .deliveryDateTimes(product.getDeliveryDateTimes())
                .isActive(product.getIsActive())
                .createAt(product.getCreateAt())
                .updateAt(product.getUpdateAt());

        if (product.getSupplier() != null) {
            builder.supplierId(product.getSupplier().getId());
        }
        return builder.build();
    }

    @Override
    public Page<ProductResponse> getProductBySupplierId(String supplierId, int page, int size) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_FOUND));
        if(supplier.getStatus() == SupplierStatus.REJECTED){
            throw new AppException(ErrorCode.SUPPLIER_NOT_FOUND);
        }
        if(supplier.getStatus() == SupplierStatus.DELETED){
            throw new AppException(ErrorCode.SUPPLIER_NOT_FOUND);
        }

        Pageable pageable = PageRequest.of(page, size);
        return supplierProductRepository.findBySupplierIdAndIsActiveTrue(supplierId, pageable)
                .map(this::mapToProductResponse);
    }

    @Override
    public ProductResponse createSupplierProduct(String supplierId, SupplierProductCreateRequest request) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_FOUND));
        if (supplierProductRepository.findBySupplierIdAndProductId(supplierId, request.getProductId()).isPresent()) {
            throw new AppException(ErrorCode.PRODUCT_OR_SUPPLIER_ALREADY_EXISTS );
        }

        SupplierProduct supplierProduct = SupplierProduct.builder()
                .supplier(supplier)
                .productId(request.getProductId())
                .price(request.getPrice())
                .deliveryDateTimes(request.getDeliveryDateTimes())
                .isActive(true)
                .build();

        SupplierProduct saved = supplierProductRepository.save(supplierProduct);
        saveProductAuditLog(supplier, null, saved, "admin_user", AuditAction.CREATE);
        return mapToProductResponse(saved);
    }


    private ProductResponse mapToProductResponse(SupplierProduct product) {
        return ProductResponse.builder()
                .id(product.getId())
                .productId(product.getProductId())
                .price(product.getPrice())
                .deliveryDateTimes(product.getDeliveryDateTimes())
                .isActive(product.getIsActive())
                .supplierId(product.getSupplier() != null ? product.getSupplier().getId() : null)
                .createAt(product.getCreateAt())
                .updateAt(product.getUpdateAt())
                .build();
    }

    @Override
    public List<SupplierComparisonResponse> compareSuppliersByProduct(String productId) {
        List<SupplierProduct> products = supplierProductRepository.findByProductIdAndIsActiveTrue(productId);
        if (products.isEmpty()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        // Filter out products whose suppliers are not approved
        List<SupplierProduct> validProducts = new ArrayList<>();
        for (SupplierProduct p : products) {
            if (p.getSupplier() != null && p.getSupplier().getStatus() == SupplierStatus.APPROVED) {
                validProducts.add(p);
            }
        }

        if (validProducts.isEmpty()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        //Find min price and quick delivery
        double minPrice = Double.MAX_VALUE;
        int minDeliveryDays = Integer.MAX_VALUE;

        for (SupplierProduct p : products) {
            if (p.getPrice() != null && p.getPrice().doubleValue() > 0 && p.getPrice().doubleValue() < minPrice) {
                minPrice = p.getPrice().doubleValue();
            }
            if (p.getDeliveryDateTimes() != null && p.getDeliveryDateTimes() > 0 &&  p.getDeliveryDateTimes() < minDeliveryDays) {
                minDeliveryDays = p.getDeliveryDateTimes();
            }
        }

        // Handle case where all products have null price or delivery days
        if (minPrice == Double.MAX_VALUE) minPrice = 0.0;
        if (minDeliveryDays == Integer.MAX_VALUE) minDeliveryDays = 1;

        // Calculate score for each supplier and prepare response
        List<SupplierComparisonResponse> resultList = new ArrayList<>();
        for (SupplierProduct product : validProducts) {
            double price = 0;
            if (product.getPrice() != null) {
                price = product.getPrice().doubleValue();
            }

            double rating = 0.0;
            if (product.getSupplier().getRating() != null) {
                rating = product.getSupplier().getRating().doubleValue();
            }

            int deliveryDays = 0;
            if (product.getDeliveryDateTimes() != null) {
                deliveryDays = product.getDeliveryDateTimes();
            }

            double totalScore = calculateScore100(price,minPrice, rating, deliveryDays, minDeliveryDays);

            SupplierComparisonResponse responseItem = new SupplierComparisonResponse();
            responseItem.setSupplierId(product.getSupplier().getId());
            responseItem.setSupplierName(product.getSupplier().getName());
            responseItem.setOverallRating(product.getSupplier().getRating());
            responseItem.setProductId(product.getProductId());
            responseItem.setPrice(product.getPrice());
            responseItem.setDeliveryDateTimes(product.getDeliveryDateTimes());
            responseItem.setRecommendationScore(totalScore);

            resultList.add(responseItem);
        }
            Collections.sort(resultList, new Comparator<SupplierComparisonResponse>() {
                @Override
                public int compare(SupplierComparisonResponse o1, SupplierComparisonResponse o2) {
                    return o2.getRecommendationScore().compareTo(o1.getRecommendationScore());
                }
            });
            return resultList;
    }

    @Override
    public ProductResponse updateSupplierProduct(String productId, String supplierId, SupplierProductUpdateRequest request) {
        SupplierProduct supplierProduct = supplierProductRepository.findBySupplierIdAndProductId(supplierId, productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        boolean isChanged = false;

        //clone dữ liệu cũ
        SupplierProduct oldData = SupplierProduct.builder()
                .id(supplierProduct.getId())
                .supplier(supplierProduct.getSupplier())
                .productId(supplierProduct.getProductId())
                .price(supplierProduct.getPrice())
                .deliveryDateTimes(supplierProduct.getDeliveryDateTimes())
                .isActive(supplierProduct.getIsActive())
                .createAt(supplierProduct.getCreateAt())
                .updateAt(supplierProduct.getUpdateAt())
                .build();

        if (request.getPrice() != null && request.getPrice().compareTo(supplierProduct.getPrice()) != 0) {
            supplierProduct.setPrice(request.getPrice());
            isChanged = true;
        }

        if (request.getDeliveryDateTimes() != null && !request.getDeliveryDateTimes().equals(supplierProduct.getDeliveryDateTimes())) {
            supplierProduct.setDeliveryDateTimes(request.getDeliveryDateTimes());
            isChanged = true;
        }

        if (request.getIsActive() != null && !request.getIsActive().equals(supplierProduct.getIsActive())) {
            supplierProduct.setIsActive(request.getIsActive());
            isChanged = true;
        }

        if (isChanged) {
            supplierProduct = supplierProductRepository.save(supplierProduct);
            saveProductAuditLog(supplierProduct.getSupplier(), oldData, supplierProduct, "admin_user", AuditAction.UPDATE);
        }
        return modelMapper.map(supplierProduct, ProductResponse.class);
    }

    private double calculateScore100(double currentPrice, double minPrice, double rating, int currentDelivery, int minDelivery) {

        // 1. Điểm Uy tín (Tối đa 40 điểm)
        double ratingScore = (rating / 5.0) * 40.0;

        // 2. Điểm Giá cả (Tối đa 40 điểm)
        double priceScore = 0.0;
        if (currentPrice > 0) {
            priceScore = (minPrice / currentPrice) * 40.0;
        }

        // 3. Điểm Giao hàng (Tối đa 20 điểm)
        double deliveryScore = 0.0;
        if (currentDelivery > 0) {
            deliveryScore = ((double) minDelivery / currentDelivery) * 20.0;
        } else {
            deliveryScore = 20.0;
        }

        // 4. Tổng kết điểm
        double finalScore = ratingScore + priceScore + deliveryScore;

        return Math.round(finalScore * 100.0) / 100.0;
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }

    private void saveProductAuditLog(Supplier supplier, SupplierProduct oldData, SupplierProduct newData, String performedBy, com.group4.supplier_service.enums.AuditAction action) {
        String oldDataJson = (oldData != null) ? toJson(oldData) : null;
        String newDataJson = (newData != null) ? toJson(newData) : null;

        SupplierAuditLog auditLog = SupplierAuditLog.builder()
                .supplier(supplier)
                .action(action)
                .oldData(oldDataJson)
                .newData(newDataJson)
                .performedBy(performedBy)
                .performedAt(java.time.LocalDateTime.now())
                .build();

        auditLogRepository.save(auditLog);
    }
}
