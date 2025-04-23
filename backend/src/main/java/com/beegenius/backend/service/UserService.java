package com.beegenius.backend.service;

import com.beegenius.backend.model.User;
import com.beegenius.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordService passwordService = new PasswordService();

    public User signup(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        String passwordEncoded = passwordService.hashPassword(user.getPassword());
        user.setPassword(passwordEncoded);
        return userRepository.save(user);
    }

    public User login(String email, String password) {

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            if(passwordService.matches(password, user.get().getPassword()))
                return user.get();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    public User findUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }
}
