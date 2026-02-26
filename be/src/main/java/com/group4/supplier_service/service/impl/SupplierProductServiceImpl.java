package com.group4.supplier_service.service.impl;

import com.group4.supplier_service.dto.ProductResponse;
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
                .map(product -> modelMapper.map(product, ProductResponse.class));
    }
}
