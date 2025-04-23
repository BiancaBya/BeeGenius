package com.beegenius.backend.repository;

import com.beegenius.backend.model.Material;
import com.beegenius.backend.model.enums.Tags;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends MongoRepository<Material, String> {
    List<Material> searchMaterialByNameContaining(String name);

    List<Material> findAllByTagsContaining(Tags tags);
}


