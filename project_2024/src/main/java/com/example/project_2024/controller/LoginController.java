package com.example.project_2024.controller;


import com.example.project_2024.pojo.Result;
import com.example.project_2024.pojo.LoginUser;
import com.example.project_2024.service.LoginService;
import com.example.project_2024.utils.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/login")
//@CrossOrigin(origins="*",maxAge = 3600)
public class LoginController {
    @Autowired
    private LoginService LoginService;

    @PostMapping("/loginin")
    public Result login(@RequestBody LoginUser loginuser){
        log.info("员工信息：{}",loginuser);
        LoginUser e  = LoginService.login(loginuser);

        if(e != null){
//            Map<String,Object> claims = new HashMap<>();
//            claims.put("name",e.getName());
//            claims.put("password",e.getPassword());
//
//            String jwt = JwtUtils.generateJwt(claims);
//            return Result.success(jwt);
            return Result.success("登录成功");
        }
        return Result.error("用户名或密码错误");
    }

    @PostMapping("/register")
    public Result register(@RequestBody LoginUser loginuser){

        Result result = LoginService.addUser(loginuser);

        return result;

    }
}
