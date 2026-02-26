package com.group4.supplier_service.exception;

import com.group4.supplier_service.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    //Xử lý lỗi do team tự custom
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<Void>> handlingAppException(AppException ex){
        ErrorCode errorCode = ex.getErrorCode();

        // Sử dụng ApiResponse để đồng bộ format với Controller
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity
                .status(errorCode.getHttpStatus()) // SỬA Ở ĐÂY: Dùng getHttpStatus() thay vì getCode()
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
