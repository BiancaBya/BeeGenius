package com.beegenius.backend.model;

import com.beegenius.backend.model.enums.MaterialType;
import com.beegenius.backend.model.enums.Tags;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Document(collection = "materials")
public class Material extends BaseEntity {

    private String name;

    private String description;

    private MaterialType type;

    private String path;

    private float rating;

    private int nrRatings;

    private List<Tags> tags = new ArrayList<>();

    @DBRef
    private User user;

}


