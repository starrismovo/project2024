package com.example.project_2024.service.Impl;

import com.example.project_2024.domain.FactorBody;
import com.example.project_2024.domain.FactorMileage;
import com.example.project_2024.domain.FactorPlatbox;
import com.example.project_2024.domain.FactorSale;
import com.example.project_2024.mapper.FactorMapper;
import com.example.project_2024.service.FactorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FactorServiceImpl implements FactorService {

    @Autowired
    private FactorMapper factorMapper;

    @Override
    public List<FactorSale> getMarketSale() {

        return factorMapper.getMarketSale();
    }

    @Override
    public List<FactorBody> getMarketBody() {

        return factorMapper.getMarketBody();
    }

    @Override
    public List<FactorMileage> getMarketMileage() {

        return factorMapper.getMarketMileage();
    }

    @Override
    public List<FactorPlatbox> getMarketPlatbox() {

        return factorMapper.getMarketPlatbox();
    }

}
