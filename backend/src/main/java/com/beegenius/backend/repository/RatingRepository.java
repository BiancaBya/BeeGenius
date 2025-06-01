package com.beegenius.backend.repository;

import com.beegenius.backend.model.Material;
import com.beegenius.backend.model.Rating;
import com.beegenius.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends MongoRepository<Rating, String> {
    Optional<Rating> findByUserAndMaterial(User user, Material material);
}
