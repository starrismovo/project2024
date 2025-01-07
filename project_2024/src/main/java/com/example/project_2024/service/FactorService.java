package com.example.project_2024.service;

import com.example.project_2024.domain.FactorBody;
import com.example.project_2024.domain.FactorMileage;
import com.example.project_2024.domain.FactorPlatbox;
import com.example.project_2024.domain.FactorSale;

import java.util.List;

public interface FactorService {
    List<FactorSale> getMarketSale();

    List<FactorBody> getMarketBody();

    List<FactorMileage> getMarketMileage();

    List<FactorPlatbox> getMarketPlatbox();
}
