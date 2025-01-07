package com.example.project_2024.controller;

import com.example.project_2024.domain.User;
import com.example.project_2024.service.Impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    @GetMapping("/start")
    public String start(){
        return "hello world";
    }

    @GetMapping("/getUser")
    public List<User> getUser() {
        List<User> get = userService.getUser();
        return get;
    }

    @PostMapping("/postUser")
    public List<User> postUser(@RequestParam("id") int id) {
        List<User> post = userService.postUser(id);
        return post;
    }

}
