package com.example.project_2024.mapper;

import com.example.project_2024.domain.FactorBody;
import com.example.project_2024.domain.FactorMileage;
import com.example.project_2024.domain.FactorPlatbox;
import com.example.project_2024.domain.FactorSale;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FactorMapper {
    List<FactorSale> getMarketSale();

    List<FactorBody> getMarketBody();

    List<FactorMileage> getMarketMileage();

    List<FactorPlatbox> getMarketPlatbox();
}
