package com.group4.supplier_service.dto.request;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class DashboardSummaryResponse {
    private SupplierMetrics supplierMetrics;
    private ProductMetrics productMetrics;
    private List<TopSupplierResponse> topSuppliers;
    private List<RecentActivityResponse> recentActivities;

    @Data
    @Builder
    public static class ProductMetrics {
        private long total;
        private long active;
    }

    @Data
    @Builder
    public static class SupplierMetrics {
        private long total;
        private long pending;
        private long approved;
        private long suspended;
        private long rejected;
        private long deleted;
        private long newThisMonth;
    }

    @Data
    @Builder
    public static class TopSupplierResponse{
        private String id;
        private String name;
        private BigDecimal rating;
    }

    @Data
    @Builder
    public static class RecentActivityResponse {
        private String supplierName;
        private String action;
        private  String performedBy;
        private LocalDateTime performedAt;
    }


}
