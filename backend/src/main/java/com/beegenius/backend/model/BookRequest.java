package com.beegenius.backend.model;

import com.beegenius.backend.model.enums.Status;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Getter
@Setter
@Document(collection = "book_requests")
public class BookRequest extends BaseEntity{
    @DBRef
    private Book book;

    @DBRef
    private User requester;

    private Status status;

    private LocalDate date;
}
