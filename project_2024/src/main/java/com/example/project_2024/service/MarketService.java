package com.example.project_2024.service;

import com.example.project_2024.domain.*;

import java.util.List;

public interface MarketService {
    List<MarketBrand> getMarketBrand();

    List<MarketFuel> getMarketFuel();

    List<MarketTrade> getMarketTrade();

    List<MarketPrice> getMarketPrice();

    List<MarketOrders> getMarketOrders();

    List<MarketLeft2> getMarketLeft2();
}
