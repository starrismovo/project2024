package com.example.project_2024.service;

import com.example.project_2024.pojo.Result;
import com.example.project_2024.pojo.LoginUser;

public interface LoginService {
    LoginUser login(LoginUser loginuser);

    Result addUser(LoginUser loginuser);
}

