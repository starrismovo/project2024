package com.example.project_2024.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginUser {
    private Integer userid; //ID 自增
    private String username; //用户名
    private String password; //密码
    private String name; //姓名
    private String sex; //性别
    private Integer age; //年龄
}
