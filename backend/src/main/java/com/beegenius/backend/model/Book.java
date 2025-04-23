package com.beegenius.backend.model;

import com.beegenius.backend.model.enums.Tags;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Document(collection = "books")
public class Book extends BaseEntity{
    private String title;

    private String author;

    private List<Tags> tags = new ArrayList<>();

    private String photoPath;

    @DBRef
    private User owner;
}
