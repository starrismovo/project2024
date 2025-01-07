package com.example.project_2024.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketFuel {
    private String fuelTypeName; // 燃料种类
    private Integer quantity; // 出现频率
}
