package com.group4.supplier_service.exception;

import com.group4.supplier_service.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    //Xử lý lỗi do team tự custom
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<Object>> handlingAppException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode();

        ApiResponse<Object> response = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .result(ex.getErrors())
                .build();

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(response);
    }

    //Xử lý lỗi ko xác định được
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<Map<String, Object>> handlingRuntimeException(RuntimeException exception) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        response.put("message", ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());

        return ResponseEntity.badRequest().body(response);
    }
}
