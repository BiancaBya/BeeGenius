package com.beegenius.backend.controller;

import com.beegenius.backend.model.User;
import com.beegenius.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public Object signup(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.signup(user));
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public Object login(@RequestParam String email, @RequestParam String password) {
        try {
            return ResponseEntity.ok(userService.login(email, password));
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
