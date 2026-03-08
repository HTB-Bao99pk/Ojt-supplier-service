package com.group4.supplier_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // LỖI HỆ THỐNG CHUNG
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    // -- SUPPLIER SERVICE ERRORS (401 -> 500) --
    SUPPLIER_NOT_FOUND(401, "Supplier not found", HttpStatus.NOT_FOUND),
    SUPPLIER_ALREADY_EXISTS(402, "Supplier name already exists", HttpStatus.CONFLICT),
    EMAIL_ALREADY_USED(403, "Contact email is already in use", HttpStatus.CONFLICT),
    INVALID_INPUT(404, "Invalid input data", HttpStatus.BAD_REQUEST),
    INVALID_FORMAT(405, "Invalid data format", HttpStatus.BAD_REQUEST),
    PHONE_ALREADY_USED(406, "Phone number is already in use", HttpStatus.CONFLICT),
    SUPPLIER_NAME_ALREADY_USED(407, "Supplier name is already in use", HttpStatus.CONFLICT),
    SUPPLIER_NAME_NOT_BLANK(408, "Supplier name must not be blank", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL_FORMAT(409, "Invalid email format", HttpStatus.BAD_REQUEST),
    CONTACT_EMAIL_NOT_BLANK(410, "Contact email must not be blank", HttpStatus.BAD_REQUEST),
    TAX_CODE_NOT_BLANK(411, "Tax code must not be blank", HttpStatus.BAD_REQUEST),
    MATERIALS_NOT_BLANK(412, "Materials must not be blank", HttpStatus.BAD_REQUEST),
    PHONE_NOT_BLANK(413, "Phone number must not be blank", HttpStatus.BAD_REQUEST),
    INVALID_PHONE_FORMAT(414, "Phone number format is invalid (e.g. 0901234567)", HttpStatus.BAD_REQUEST),
    ADDRESS_NOT_BLANK(415, "Address must not be blank", HttpStatus.BAD_REQUEST),
    REGION_NOT_BLANK(416, "Region must not be blank", HttpStatus.BAD_REQUEST),


    // -- SUPPLIER PRODUCT SERVICE ERRORS (501 -> 600) --
    PRODUCT_NOT_FOUND(501, "Product not found", HttpStatus.NOT_FOUND),
    DELIVERY_TIME_MUST_BE_AT_LEAST_1(502, "Delivery time must be greater than or equal 1", HttpStatus.BAD_REQUEST),
    PRICE_MUST_BE_POSITIVE(503, "Price must be a positive number", HttpStatus.BAD_REQUEST),
    PRODUCT_OR_SUPPLIER_ALREADY_EXISTS(504, "Product or supplier already exists for this supplier", HttpStatus.CONFLICT),
    PRODUCT_ID_NOT_BLANK(505, "Product ID must not be blank", HttpStatus.BAD_REQUEST),
    PRICE_NOT_NULL(506, "Price must not be null", HttpStatus.BAD_REQUEST),
    DELIVERY_TIME_NOT_NULL(507, "Delivery date times must not be null", HttpStatus.BAD_REQUEST);
    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
