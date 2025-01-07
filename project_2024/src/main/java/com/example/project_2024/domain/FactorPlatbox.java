package com.example.project_2024.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FactorPlatbox {
    private String brands;
    private Integer min;
    private Integer Q1;
    private Integer median;
    private Integer Q3;
    private Integer max;
}
