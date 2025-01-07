package com.example.project_2024.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginUser {

    private Integer id; //ID 自增
    private String name; //用户名
    private String password; //密码
    private String sex; //姓名
}
