package com.beegenius.backend.controller;

import com.beegenius.backend.model.Material;
import com.beegenius.backend.model.enums.MaterialType;
import com.beegenius.backend.model.enums.Tags;
import com.beegenius.backend.service.MaterialService;
import com.beegenius.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
public class MaterialController {

    private static final Logger logger = LogManager.getLogger(MaterialController.class);
    private final MaterialService materialService;
    private final UserService userService;

    private static final String MATERIAL_UPLOAD_DIR = "uploads/materials";

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Material> createMaterial(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam MaterialType type,
            @RequestParam List<Tags> tags,
            @RequestParam MultipartFile file,
            @RequestParam String userId
    ) throws IOException {
        logger.info("Entering createMaterial - name={}, type={}, userId={}", name, type, userId);
        try {
            Path uploadDir = Paths.get(MATERIAL_UPLOAD_DIR);
            if (Files.notExists(uploadDir)) {
                Files.createDirectories(uploadDir);
                logger.info("Created upload directory {}", uploadDir);
            }

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);
            Files.write(filePath, file.getBytes());
            logger.info("Uploaded file to {}", filePath);

            Material material = new Material();
            material.setName(name);
            material.setDescription(description);
            material.setType(type);
            material.setTags(tags);
            material.setPath(filePath.toString());
            material.setRating(0f);
            material.setNrRatings(0);
            material.setUser(userService.findUserById(userId));

            Material saved = materialService.saveMaterial(material);
            logger.info("Material created successfully - id={}, by userId={}", saved.getId(), userId);
            logger.info("Exiting createMaterial with status=200");
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            logger.error("IO error in createMaterial for userId={}", userId, e);
            throw e;
        } catch (Exception e) {
            logger.error("Error in createMaterial for userId={}", userId, e);
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<List<Material>> getAllMaterials() {
        logger.info("Entering getAllMaterials");
        List<Material> materials = materialService.findAllMaterials();
        if (materials.isEmpty()) {
            logger.info("No materials found");
            logger.info("Exiting getAllMaterials with status=204");
            return ResponseEntity.noContent().build();
        }
        logger.info("Retrieved {} materials", materials.size());
        logger.info("Exiting getAllMaterials with status=200");
        return ResponseEntity.ok(materials);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMaterial(@PathVariable String id) {
        logger.info("Entering deleteMaterial - id={}", id);
        materialService.deleteMaterial(id);
        logger.info("Deleted material with id={}", id);
        logger.info("Exiting deleteMaterial with status=200");
        return ResponseEntity.ok("Material deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Material>> searchMaterial(@RequestParam String name) {
        logger.info("Entering searchMaterial - name={}", name);
        List<Material> foundMaterials = materialService.searchMaterialByName(name);
        if (foundMaterials.isEmpty()) {
            logger.info("No materials found matching name={}", name);
            logger.info("Exiting searchMaterial with status=204");
            return ResponseEntity.noContent().build();
        }
        logger.info("Found {} materials matching name={}", foundMaterials.size(), name);
        logger.info("Exiting searchMaterial with status=200");
        return ResponseEntity.ok(foundMaterials);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Material>> filterMaterial(@RequestParam Tags tag) {
        logger.info("Entering filterMaterial - tag={}", tag);
        List<Material> foundMaterials = materialService.filterMaterialsByTags(tag);
        if (foundMaterials.isEmpty()) {
            logger.info("No materials found with tag={}", tag);
            logger.info("Exiting filterMaterial with status=204");
            return ResponseEntity.noContent().build();
        }
        logger.info("Found {} materials with tag={}", foundMaterials.size(), tag);
        logger.info("Exiting filterMaterial with status=200");
        return ResponseEntity.ok(foundMaterials);
    }

    @PutMapping("/rating")
    public ResponseEntity<String> addRating(@RequestParam String materialId, @RequestParam float rating) {
        logger.info("Entering addRating - materialId={}, rating={}", materialId, rating);
        materialService.addRaiting(materialService.getMaterialById(materialId), rating);
        logger.info("Added rating {} to materialId={}", rating, materialId);
        logger.info("Exiting addRating with status=200");
        return ResponseEntity.ok("Rating added successfully");
    }

    @PutMapping("/update")
    public ResponseEntity<Material> updateMaterial(
            @RequestParam String materialId,
            @RequestParam String description,
            @RequestParam List<Tags> tags) {
        logger.info("Entering updateMaterial - materialId={}", materialId);
        Material material = materialService.getMaterialById(materialId);
        material.setDescription(description);
        material.setTags(tags);
        Material updated = materialService.updateMaterial(material);
        logger.info("Updated material id={}", materialId);
        logger.info("Exiting updateMaterial with status=200");
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Material> getMaterialById(@PathVariable String id) {
        logger.info("Entering getMaterialById - id={}", id);
        Material material = materialService.getMaterialById(id);
        if (material == null) {
            logger.info("Material not found for id={}", id);
            logger.info("Exiting getMaterialById with status=404");
            return ResponseEntity.notFound().build();
        }
        logger.info("Retrieved material id={}", id);
        logger.info("Exiting getMaterialById with status=200");
        return ResponseEntity.ok(material);
    }
}



