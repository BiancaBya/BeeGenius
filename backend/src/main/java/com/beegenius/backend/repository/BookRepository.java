package com.beegenius.backend.repository;

import com.beegenius.backend.model.Book;
import com.beegenius.backend.model.enums.Tags;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    public List<Book> findByTagsContaining(Tags tag);
    public List<Book> findBookByTitleContaining(String title);
}
