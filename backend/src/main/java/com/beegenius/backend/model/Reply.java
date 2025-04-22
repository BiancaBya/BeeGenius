package com.beegenius.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Document(collection = "replies")
public class Reply extends BaseEntity {

    private String content;

    @DBRef
    private User user;

    @DBRef
    private List<Reply> replies = new ArrayList<>();

}
