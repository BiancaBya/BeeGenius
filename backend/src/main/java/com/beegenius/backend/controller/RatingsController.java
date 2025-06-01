package com.beegenius.backend.controller;

import com.beegenius.backend.service.MaterialService;
import com.beegenius.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingsController {

    private static final Logger logger = LogManager.getLogger(RatingsController.class);
    private final MaterialService materialService;
    private final UserService userService;

    /**
     * GET /api/ratings/user-rating?userId={userId}&materialId={materialId}
     * Returnează rating-ul (1..5) pe care utilizatorul l-a dat materialului,
     * sau 0 dacă nu a votat încă.
     */
    @GetMapping("/user-rating")
    public ResponseEntity<Integer> getUserRating(
            @RequestParam String userId,
            @RequestParam String materialId
    ) {
        logger.info("Entering getUserRating - userId={}, materialId={}", userId, materialId);

        try {
            // Verificăm întâi că userul și materialul există
            if (userService.findUserById(userId) == null) {
                logger.warn("User not found: {}", userId);
                return ResponseEntity.badRequest().body(0);
            }
            if (materialService.getMaterialById(materialId) == null) {
                logger.warn("Material not found: {}", materialId);
                return ResponseEntity.badRequest().body(0);
            }

            // Metodă în MaterialService care returnează rating-ul (0 dacă nu există)
            int rating = materialService.getUserRatingForMaterial(materialId, userId);
            logger.info("Returning rating={} for userId={}, materialId={}", rating, userId, materialId);
            return ResponseEntity.ok(rating);
        } catch (Exception e) {
            logger.error("Error in getUserRating for userId={}, materialId={}", userId, materialId, e);
            return ResponseEntity.status(500).body(0);
        }
    }
}
