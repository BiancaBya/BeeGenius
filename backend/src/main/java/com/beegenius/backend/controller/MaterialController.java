package com.beegenius.backend.controller;

import com.beegenius.backend.model.Material;
import com.beegenius.backend.model.enums.MaterialType;
import com.beegenius.backend.model.enums.Tags;
import com.beegenius.backend.service.MaterialService;
import com.beegenius.backend.service.UserService;
import lombok.RequiredArgsConstructor;
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
        Path uploadDir = Paths.get(MATERIAL_UPLOAD_DIR);
        if (Files.notExists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(filename);

        Files.write(filePath, file.getBytes());

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
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Material>> getAllMaterials() {
        List<Material> materials = materialService.findAllMaterials();
        return materials.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(materials);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMaterial(@PathVariable String id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.ok("Material deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Material>> searchMaterial(@RequestParam String name) {
        List<Material> foundMaterials = materialService.searchMaterialByName(name);
        return foundMaterials.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(foundMaterials);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Material>> filterMaterial(@RequestParam Tags tag) {
        List<Material> foundMaterials = materialService.filterMAterialsByTags(tag);
        return foundMaterials.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(foundMaterials);
    }

    @PutMapping("/rating")
    public ResponseEntity<String> addRating(@RequestParam String materialId, @RequestParam float rating) {
        materialService.addRaiting(materialService.getMaterialById(materialId), rating);
        return ResponseEntity.ok("Rating added successfully");
    }

    @PutMapping("/update")
    public ResponseEntity<Material> updateMaterial(@RequestParam String materialId,
                                                   @RequestParam String description,
                                                   @RequestParam List<Tags> tags){
        Material material = materialService.getMaterialById(materialId);
        material.setDescription(description);
        material.setTags(tags);
        Material updated = materialService.updateMaterial(material);
        return ResponseEntity.ok(updated);
    }

}


