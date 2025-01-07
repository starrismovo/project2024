package com.example.project_2024.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketOrders {
    private String regDate;
    private String priceRange;
    private String countRange;
}
