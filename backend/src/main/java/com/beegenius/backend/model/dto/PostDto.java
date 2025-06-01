package com.beegenius.backend.model.dto;

import com.beegenius.backend.model.User;
import com.beegenius.backend.model.enums.Tags;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
@Builder
public class PostDto {
    private String id;
    private String title;
    private String content;
    private LocalDate date;
    private List<Tags> tags;
    private User user;

    private int repliesCount;
    private String timeAgo;
}
