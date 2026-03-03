package com.group4.supplier_service.service.impl;

import com.group4.supplier_service.dto.request.SupplierProductCreateRequest;
import com.group4.supplier_service.dto.response.ProductResponse;
import com.group4.supplier_service.dto.response.SupplierComparisonResponse;
import com.group4.supplier_service.entity.Supplier;
import com.group4.supplier_service.entity.SupplierProduct;
import com.group4.supplier_service.exception.AppException;
import com.group4.supplier_service.exception.ErrorCode;
import com.group4.supplier_service.repository.SupplierProductRepository;
import com.group4.supplier_service.repository.SupplierRepository;
import com.group4.supplier_service.service.SupplierProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierProductServiceImpl implements SupplierProductService {
    SupplierRepository supplierRepository;
    SupplierProductRepository supplierProductRepository;
    ModelMapper modelMapper;

    @Override
    public Page<ProductResponse> getProductBySupplierId(String supplierId, int page, int size) {
        if(!supplierRepository.existsById(supplierId)){
            throw new AppException(ErrorCode.SUPPLIER_NOT_FOUND);
        }
        Pageable pageable = PageRequest.of(page, size);
        return supplierProductRepository.findBySupplierId(supplierId, pageable)
                .map(this::mapToProductResponse);
    }

    @Override
    public ProductResponse createSupplierProduct(String supplierId, SupplierProductCreateRequest request) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_FOUND));

        SupplierProduct supplierProduct = SupplierProduct.builder()
                .supplier(supplier)
                .productId(request.getProductId())
                .price(request.getPrice())
                .deliveryDateTimes(request.getDeliveryDateTimes())
                .isActive(true)
                .build();

        SupplierProduct saved = supplierProductRepository.save(supplierProduct);
        return mapToProductResponse(saved);
    }

    private ProductResponse mapToProductResponse(SupplierProduct product) {
        return ProductResponse.builder()
                .id(product.getId())
                .productId(product.getProductId())
                .price(product.getPrice())
                .deliveryDateTimes(product.getDeliveryDateTimes())
                .isActive(product.getIsActive())
                .build();
    }

    @Override
    public List<SupplierComparisonResponse> compareSuppliersByProduct(String productId) {
        List<SupplierProduct> products = supplierProductRepository.findByProductIdAndIsActiveTrue(productId);
        if (products.isEmpty()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        //Find min pric e and quick delivery
        double minPrice = Double.MAX_VALUE;
        int minDeliveryDays = Integer.MAX_VALUE;

        for (SupplierProduct p : products) {
            if (p.getPrice() != null && p.getPrice().doubleValue() < minPrice) {
                minPrice = p.getPrice().doubleValue();
            }
            if (p.getDeliveryDateTimes() != null && p.getDeliveryDateTimes() < minDeliveryDays) {
                minDeliveryDays = p.getDeliveryDateTimes();
            }
        }

        // Calculate score for each supplier and prepare response
        List<SupplierComparisonResponse> resultList = new ArrayList<>();
        for (SupplierProduct product : products) {
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
}
