package com.beegenius.backend.service;

import com.beegenius.backend.model.User;
import com.beegenius.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final PasswordService passwordService = new PasswordService();

    public User signup(User user) {
        logger.info("Entering signup with email={}", user.getEmail());
        try {
            if (userRepository.existsByEmail(user.getEmail())) {
                logger.error("Signup failed: email already in use={}", user.getEmail());
                throw new IllegalArgumentException("Email already in use");
            }
            String passwordEncoded = passwordService.hashPassword(user.getPassword());
            user.setPassword(passwordEncoded);
            User saved = userRepository.save(user);
            logger.info("User signed up successfully with id={}", saved.getId());
            logger.info("Exiting signup");
            return saved;
        } catch (Exception e) {
            logger.error("Error in signup for email={}", user.getEmail(), e);
            throw e;
        }
    }

    public User login(String email, String password) {
        logger.info("Entering login with email={}", email);
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent() && passwordService.matches(password, userOpt.get().getPassword())) {
                User user = userOpt.get();
                logger.info("User logged in successfully with id={}", user.getId());
                logger.info("Exiting login");
                return user;
            }
            logger.error("Login failed: invalid credentials for email={}", email);
            throw new IllegalArgumentException("Invalid credentials");
        } catch (Exception e) {
            logger.error("Error in login for email={}", email, e);
            throw e;
        }
    }

    public User findUserById(String id) {
        logger.info("Entering findUserById with id={}", id);
        try {
            User found = userRepository.findById(id).orElse(null);
            if (found != null) {
                logger.info("User found with id={}", id);
            } else {
                logger.info("No user found for id={}", id);
            }
            logger.info("Exiting findUserById");
            return found;
        } catch (Exception e) {
            logger.error("Error in findUserById for id={}", id, e);
            throw e;
        }
    }
}



