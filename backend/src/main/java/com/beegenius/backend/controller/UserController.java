package com.beegenius.backend.controller;

import com.beegenius.backend.model.BookRequest;
import com.beegenius.backend.model.User;
import com.beegenius.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {

    private static final Logger logger = LogManager.getLogger(UserController.class);
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        logger.info("Entering getUserById - id={}", id);
        User user = userService.findUserById(id);
        logger.info("User found - user={}", user);
        return ResponseEntity.ok(user);
    }

}
