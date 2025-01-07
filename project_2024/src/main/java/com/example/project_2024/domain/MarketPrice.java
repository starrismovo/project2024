package com.example.project_2024.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketPrice {
    private String priceRange; // 价格区间
    private Integer countRange; // 价格区间总数

}
