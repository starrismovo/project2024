package com.example.project_2024.service.Impl;


import com.example.project_2024.domain.*;
import com.example.project_2024.mapper.MarketMapper;
import com.example.project_2024.service.MarketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarketServiceImpl implements MarketService {
    @Autowired
    private MarketMapper marketMapper;

    @Override
    public List<MarketBrand> getMarketBrand() {

        return marketMapper.getMarketBrand();
    }

    @Override
    public List<MarketFuel> getMarketFuel() {

        return marketMapper.getMarketFuel();
    }

    @Override
    public List<MarketTrade> getMarketTrade() {

        return marketMapper.getMarketTrade();
    }

    @Override
    public List<MarketPrice> getMarketPrice() {

        return marketMapper.getMarketPrice();
    }

    @Override
    public List<MarketOrders> getMarketOrders() {

        return marketMapper.getMarketOrders();
    }

    @Override
    public List<MarketLeft2> getMarketLeft2() {

        return marketMapper.getMarketLeft2();
    }
}
