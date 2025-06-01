package com.beegenius.backend.controller;

import com.beegenius.backend.model.enums.Tags;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class TagsController {

    @GetMapping("/api/tags")
    public ResponseEntity<List<String>> getAllTags() {
        List<String> tagList = Arrays.stream(Tags.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tagList);
    }
}


