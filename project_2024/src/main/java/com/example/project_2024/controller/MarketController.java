package com.example.project_2024.controller;

import com.example.project_2024.domain.*;
import com.example.project_2024.service.MarketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
//@CrossOrigin(origins="*",maxAge = 3600)
@RequestMapping("/market")
public class MarketController {

    @Autowired
    private MarketService marketService;

    @GetMapping("/trade")
    public Map<String, Map<String, Object>> trade() {
        // 获取所有市场交易数据
        List<MarketTrade> marketTrades = marketService.getMarketTrade();
        // 用于存储最终结果的 Map，年份作为键，属性Map作为值
        Map<String, Map<String, Object>> resultMap = new HashMap<>();
        // 遍历每条市场交易数据
        for (MarketTrade trade : marketTrades) {
            // 获取每个交易的年份
            String year = trade.getRegDate();
            // 如果 resultMap 中没有当前年份的键，初始化它
            if (!resultMap.containsKey(year)) {
                resultMap.put(year, new HashMap<>());
            }
            // 获取该年份对应的 Map
            Map<String, Object> yearData = resultMap.get(year);
            // 填充该年份的数据
            yearData.put("volume", trade.getRegDateCount());        // 交易量
            yearData.put("amount", trade.getTotalPrice());        // 交易金额
            yearData.put("transactions", trade.getAccuracyRate()); // 交易次数
            yearData.put("age", trade.getStandardValue());              // 年龄

            // 你可以根据需要在这里添加更多的字段
        }
        // 返回结果
        return resultMap;
    }

    @GetMapping("/left2")
    public Map<String, Map<String, Object>> left2() {
        // 从服务层获取所有的 MarketLeft2 数据
        List<MarketLeft2> marketLeft2 = marketService.getMarketLeft2();

        // 用于存储最终结果的 Map，品牌作为键，属性 Map 作为值
        Map<String, Map<String, Object>> resultMap = new HashMap<>();

        // 遍历 MarketLeft2 列表
        for (MarketLeft2 market : marketLeft2) {
            String brands = market.getBrands();  // 获取品牌
            String regDate = market.getRegDate();  // 获取注册日期
            int cumulativeCount = market.getCumulativeCount();  // 获取累计计数
            // 如果 resultMap 中没有当前品牌的键，初始化它
            if (!resultMap.containsKey(brands)) {
                resultMap.put(brands, new HashMap<>());
            }
            Map<String, Object> brandData = resultMap.get(brands);
            // 初始化一个 sales Map 如果它还没有存在
            if (!brandData.containsKey("sales")) {
                brandData.put("sales", new HashMap<String, Integer>());
            }
            // 获取品牌的 sales Map
            Map<String, Integer> salesMap = (Map<String, Integer>) brandData.get("sales");
            // 提取年份（假设 regDate 格式是 "yyyy"）
            String year = regDate.substring(0, 4);  // 如果 regDate 是 "yyyy-MM-dd" 格式，取前四个字符作为年份
            // 将销售数据放入对应年份的 Map 中
            salesMap.put(year, cumulativeCount);
            // 更新 brandData 中的年份信息（可以选择性添加）
            //brandData.put("name", brands);  // 可以存储品牌名称

            // 如果你需要将累计的年份信息添加到 `brandData`，可以放在这里
        }

        return resultMap;
    }

    @GetMapping("/wordCloud")
    public List<MarketBrand> brands() {
        List<MarketBrand> marketBrand = marketService.getMarketBrand();
        return marketBrand;
    }

    @GetMapping("/fuel")
    public List<MarketFuel> fuel() {
        List<MarketFuel> marketBrand = marketService.getMarketFuel();
        return marketBrand;
    }

    @GetMapping("/price")
    public List<MarketPrice> price() {
        List<MarketPrice> marketPrice = marketService.getMarketPrice();
        return marketPrice;
    }

    @GetMapping("/orders")
    public List<MarketOrders> orders() {
        List<MarketOrders> marketOrders = marketService.getMarketOrders();
        return marketOrders;
    }

}
