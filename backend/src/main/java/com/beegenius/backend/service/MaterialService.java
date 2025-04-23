package com.beegenius.backend.service;

import com.beegenius.backend.model.Material;
import com.beegenius.backend.model.enums.Tags;
import com.beegenius.backend.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;

    public Material saveMaterial(Material material) {
        return materialRepository.save(material);
    }

    public void deleteMaterial(String id) {
        materialRepository.deleteById(id);
    }

    public Material updateMaterial(Material material) {return materialRepository.save(material);}

    public List<Material> findAllMaterials() {
        return materialRepository.findAll();
    }

    public List<Material> searchMaterialByName(String name) { return materialRepository.searchMaterialByNameContaining(name); }

    public List<Material> filterMAterialsByTags(Tags tags) {return materialRepository.findAllByTagsContaining(tags);}

    public void addRaiting(Material material, float newRating) {
        material.setNrRatings(material.getNrRatings() + 1);
        material.setRating(material.getRating() + newRating);
        materialRepository.save(material);
    }

    public Material getMaterialById(String id) {
        return materialRepository.findById(id).orElse(null);
    }
}


