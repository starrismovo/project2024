package com.example.project_2024.service.Impl;

import com.example.project_2024.mapper.UserMapper;
import com.example.project_2024.domain.User;
import com.example.project_2024.service.UserService;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    public List<User> getUser() {
        return userMapper.getUser();
    }

    public List<User> postUser(int id) {
        List<User> result;
        result = userMapper.postUser();
        return result;

    }
}
