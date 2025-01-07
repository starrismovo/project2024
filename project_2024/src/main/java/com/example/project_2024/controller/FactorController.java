package com.example.project_2024.controller;

import com.example.project_2024.domain.FactorBody;
import com.example.project_2024.domain.FactorMileage;
import com.example.project_2024.domain.FactorPlatbox;
import com.example.project_2024.domain.FactorSale;
import com.example.project_2024.service.FactorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/factor")
public class FactorController {
    @Autowired
    private FactorService factorService;

    @GetMapping("/body")
    public List<FactorBody> body() {
        List<FactorBody> factorBody = factorService.getMarketBody();
        return factorBody;
    }

    @GetMapping("/sale")
    public Map<String, List<String>> sales() {
        List<FactorSale> factorSale = factorService.getMarketSale();
        // 创建存储 regDate 和 totalSales 的列表
        List<String> regDates = new ArrayList<>();
        List<String> totalSales = new ArrayList<>();
        // 遍历销售记录，填充数据
        for (FactorSale sale : factorSale) {
            regDates.add(sale.getRegDate().toString());  // 假设 regDate 是一个整数或者字符串
            totalSales.add(sale.getTotalSales().toString());  // 假设 totalSales 是一个数字或字符串
        }
        // 使用 Map 返回数据
        Map<String, List<String>> result = new HashMap<>();
        result.put("regDate", regDates);
        result.put("totalSales", totalSales);
        return result;
    }
    @GetMapping("/mileage")
    public List<FactorMileage> mileage() {
        List<FactorMileage> factorMileage = factorService.getMarketMileage();
        return factorMileage;
    }


    @GetMapping("/platbox")
    public List<FactorPlatbox> platbox() {
        List<FactorPlatbox> factorPlatbox = factorService.getMarketPlatbox();
        return factorPlatbox;
    }

    @GetMapping("/radar")
    public List<FactorPlatbox> radar() {
        List<FactorPlatbox> factorPlatbox = factorService.getMarketPlatbox();
        return factorPlatbox;
    }

}
