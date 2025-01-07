package com.example.project_2024.mapper;

import com.example.project_2024.pojo.LoginUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface LoginMapper {
//     @Select("select * from tbl_c_loginuser where username=#{username} and password=#{password}")
     LoginUser getByUserNameAndPassword(LoginUser loginuser);

//     @Select("select * from tbl_c_loginuser where username =#{username}")
     LoginUser getByUsername(LoginUser loginuser);

//    @Insert("insert into tbl_c_loginuser ( userid, username, password, `name`, sex, age) values (#{userid},#{username},#{password},#{name},#{sex},#{age})")
    void addUser(LoginUser loginuser);
}
