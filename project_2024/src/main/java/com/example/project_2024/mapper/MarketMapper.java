package com.example.project_2024.mapper;

import com.example.project_2024.domain.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MarketMapper {
//    @Select("")
    List<MarketBrand> getMarketBrand();

    List<MarketFuel> getMarketFuel();

    List<MarketTrade> getMarketTrade();

    List<MarketPrice> getMarketPrice();

    List<MarketOrders> getMarketOrders();

    List<MarketLeft2> getMarketLeft2();
}
