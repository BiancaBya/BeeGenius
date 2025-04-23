package com.beegenius.backend.repository;

import com.beegenius.backend.model.BookRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRequestRepository extends MongoRepository<BookRequest, String> {
}
