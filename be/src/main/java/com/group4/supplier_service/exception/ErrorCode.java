package com.group4.supplier_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // LỖI HỆ THỐNG CHUNG
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),

    //------- 1 - 99: LỖI SUPPLIER (SUPPLIER ERRORS) --------
    SUPPLIER_NOT_FOUND(1, "Supplier not found", HttpStatus.NOT_FOUND);





    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
