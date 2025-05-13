package com.beegenius.backend.service;

import com.beegenius.backend.model.Material;
import com.beegenius.backend.model.enums.Tags;
import com.beegenius.backend.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private static final Logger logger = LoggerFactory.getLogger(MaterialService.class);
    private final MaterialRepository materialRepository;

    public Material saveMaterial(Material material) {
        logger.info("Entering saveMaterial with material={} ", material);
        try {
            Material saved = materialRepository.save(material);
            logger.info("Successfully saved Material id={} ", saved.getId());
            logger.info("Exiting saveMaterial");
            return saved;
        } catch (Exception e) {
            logger.error("Error in saveMaterial for material={} ", material, e);
            throw e;
        }
    }

    public void deleteMaterial(String id) {
        logger.info("Entering deleteMaterial with id={} ", id);
        try {
            materialRepository.deleteById(id);
            logger.info("Successfully deleted Material id={} ", id);
            logger.info("Exiting deleteMaterial");
        } catch (Exception e) {
            logger.error("Error in deleteMaterial for id={} ", id, e);
            throw e;
        }
    }

    public Material updateMaterial(Material material) {
        logger.info("Entering updateMaterial with material={} ", material);
        try {
            Material updated = materialRepository.save(material);
            logger.info("Successfully updated Material id={} ", updated.getId());
            logger.info("Exiting updateMaterial");
            return updated;
        } catch (Exception e) {
            logger.error("Error in updateMaterial for material={} ", material, e);
            throw e;
        }
    }

    public List<Material> findAllMaterials() {
        logger.info("Entering findAllMaterials");
        try {
            List<Material> list = materialRepository.findAll();
            logger.info("Found {} materials", list.size());
            logger.info("Exiting findAllMaterials");
            return list;
        } catch (Exception e) {
            logger.error("Error in findAllMaterials", e);
            throw e;
        }
    }

    public List<Material> searchMaterialByName(String name) {
        logger.info("Entering searchMaterialByName with name={} ", name);
        try {
            List<Material> results = materialRepository.searchMaterialByNameContaining(name);
            logger.info("Found {} materials matching name={}", results.size(), name);
            logger.info("Exiting searchMaterialByName");
            return results;
        } catch (Exception e) {
            logger.error("Error in searchMaterialByName for name={} ", name, e);
            throw e;
        }
    }

    public List<Material> filterMaterialsByTags(Tags tags) {
        logger.info("Entering filterMaterialsByTags with tags={} ", tags);
        try {
            List<Material> filtered = materialRepository.findAllByTagsContaining(tags);
            logger.info("Found {} materials with tags={}", filtered.size(), tags);
            logger.info("Exiting filterMaterialsByTags");
            return filtered;
        } catch (Exception e) {
            logger.error("Error in filterMaterialsByTags for tags={} ", tags, e);
            throw e;
        }
    }

    public void addRaiting(Material material, float newRating) {
        logger.info("Entering addRaiting for materialId={} with newRating={} ", material.getId(), newRating);
        try {
            material.setNrRatings(material.getNrRatings() + 1);
            material.setRating(material.getRating() + newRating);
            materialRepository.save(material);
            logger.info("Updated rating for Material id={}, totalRatings={}, cumulativeRating={} ",
                    material.getId(), material.getNrRatings(), material.getRating());
            logger.info("Exiting addRaiting");
        } catch (Exception e) {
            logger.error("Error in addRaiting for materialId={} ", material.getId(), e);
            throw e;
        }
    }

    public Material getMaterialById(String id) {
        logger.info("Entering getMaterialById with id={} ", id);
        try {
            Material found = materialRepository.findById(id).orElse(null);
            if (found != null) {
                logger.info("Material found id={} ", id);
            } else {
                logger.info("No Material found for id={} ", id);
            }
            logger.info("Exiting getMaterialById");
            return found;
        } catch (Exception e) {
            logger.error("Error in getMaterialById for id={} ", id, e);
            throw e;
        }
    }
}



