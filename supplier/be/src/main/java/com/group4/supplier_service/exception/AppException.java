package com.group4.supplier_service.exception;

import lombok.Data;

import java.util.Map;

@Data
public class AppException extends RuntimeException{
    private final ErrorCode errorCode;
    private final Map<String, String> errors;
    public AppException(ErrorCode errorCode){
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.errors = null;
    }
    public AppException(ErrorCode errorCode, Map<String, String> errors) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.errors = errors;
    }

}
