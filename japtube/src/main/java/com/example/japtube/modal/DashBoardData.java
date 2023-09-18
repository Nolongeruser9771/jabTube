package com.example.japtube.modal;

import jakarta.annotation.Nullable;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DashBoardData {
    @Nullable
    private Integer month;
    private Integer totalUsers;
    private Integer totalActiveUsers;
    private Double totalRevenue;
    private Integer totalOrders;
    private Long totalViews;
}
