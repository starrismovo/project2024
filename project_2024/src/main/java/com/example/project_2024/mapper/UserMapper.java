package com.example.project_2024.mapper;

import com.example.project_2024.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserMapper {
//    @Select("select * from user")
    List<User> getUser();
//    @Select("select * from user where #{id}")
    List<User> postUser();


}
