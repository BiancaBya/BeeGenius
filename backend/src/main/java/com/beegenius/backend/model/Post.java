package com.beegenius.backend.model;

import com.beegenius.backend.model.enums.Tags;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Document(collection = "posts")
public class Post extends BaseEntity {

    private String title;

    private String content;

    @DBRef
    private User user;

    private List<Tags> tags;

    @DBRef
    private List<Reply> replies = new ArrayList<>();


    private Date date;
}
