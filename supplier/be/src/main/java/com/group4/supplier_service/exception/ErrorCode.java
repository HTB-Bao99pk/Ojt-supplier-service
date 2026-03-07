package com.group4.supplier_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // LỖI HỆ THỐNG CHUNG
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    // -- SUPPLIER SERVICE ERRORS (401 -> 500) --
    SUPPLIER_NOT_FOUND(404, "Supplier not found", HttpStatus.NOT_FOUND),
    SUPPLIER_ALREADY_EXISTS(409, "Supplier name already exists", HttpStatus.CONFLICT),
    EMAIL_ALREADY_USED(409, "Contact email is already in use", HttpStatus.CONFLICT),
    INVALID_INPUT(400, "Invalid input data", HttpStatus.BAD_REQUEST),
    INVALID_FORMAT(400, "Invalid data format", HttpStatus.BAD_REQUEST),
    PHONE_ALREADY_USED(409, "Phone number is already in use", HttpStatus.CONFLICT),
    SUPPLIER_NAME_ALREADY_USED(409, "Supplier name is already in use", HttpStatus.CONFLICT),
    TAX_CODE_ALREADY_USED(409, "Tax code is already in use", HttpStatus.CONFLICT),

    // -- SUPPLIER PRODUCT SERVICE ERRORS (501 -> 600) --
    PRODUCT_NOT_FOUND(501, "Product not found", HttpStatus.NOT_FOUND),
    DELIVERY_TIME_MUST_BE_AT_LEAST_1(502, "Delivery time must be greater than or equal 1", HttpStatus.BAD_REQUEST),
    PRICE_MUST_BE_POSITIVE(503, "Price must be a positive number", HttpStatus.BAD_REQUEST),
    PRODUCT_OR_SUPPLIER_ALREADY_EXISTS(504, "Product or supplier already exists for this supplier", HttpStatus.CONFLICT);
    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
