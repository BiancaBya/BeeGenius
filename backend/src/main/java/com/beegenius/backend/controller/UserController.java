package com.beegenius.backend.controller;

import com.beegenius.backend.model.BookRequest;
import com.beegenius.backend.model.User;
import com.beegenius.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {

    private static final Logger logger = LogManager.getLogger(UserController.class);
    private final UserService userService;

    @PutMapping("/{id}")
    public ResponseEntity<String> getUserById(@PathVariable String id) {
        logger.info("Entering getUserById - id={}", id);
        User user = userService.findUserById(id);
        logger.info("User found - user={}", user);
        return ResponseEntity.ok("Book request accepted successfully");
    }

}
