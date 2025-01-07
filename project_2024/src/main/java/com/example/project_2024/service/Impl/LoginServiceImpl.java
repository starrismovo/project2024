package com.example.project_2024.service.Impl;

import com.example.project_2024.mapper.LoginMapper;
import com.example.project_2024.pojo.Result;

import com.example.project_2024.pojo.LoginUser;
import com.example.project_2024.service.LoginService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class LoginServiceImpl implements LoginService {
    @Autowired
    private LoginMapper loginMapper;

    @Override
    public LoginUser login(LoginUser loginuser) {

        return loginMapper.getByUserNameAndPassword(loginuser);
    }

    @Override
    public Result addUser(LoginUser loginuser) {

        //判断用户名username是否存在
        LoginUser user = loginMapper.getByUsername(loginuser);
        // 不存在则添加并返回success
        //存在则报错返回error
        if (user == null){
            loginMapper.addUser(loginuser);
            return Result.success("添加用戶成功");
        }else {
            return Result.error("用戶添加失敗，可能用戶名重复");
        }
    }
}