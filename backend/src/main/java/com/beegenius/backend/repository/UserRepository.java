package com.beegenius.backend.repository;

import com.beegenius.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    boolean existsByEmail(String username);

    Optional<User> findByEmail(String email);
}
