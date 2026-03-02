package com.group4.supplier_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // LỖI HỆ THỐNG CHUNG
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),

    SUPPLIER_NOT_FOUND(404, "Supplier not found", HttpStatus.NOT_FOUND),
    EMAIL_ALREADY_USED(409, "Contact email is already in use", HttpStatus.CONFLICT),
    INVALID_FORMAT(400, "Invalid data format", HttpStatus.BAD_REQUEST);





    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
