package com.example.project_2024.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketTrade {

    private String regDate; // 年份；
    private String regDateCount; // 成交量，单位：辆；
    private Integer totalPrice; // 成交金额，单位：元；
    private String accuracyRate; // 周转率；
    private String standardValue; // 标准值；


}
