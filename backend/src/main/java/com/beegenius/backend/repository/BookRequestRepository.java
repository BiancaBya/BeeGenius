package com.beegenius.backend.repository;

import com.beegenius.backend.model.BookRequest;
import com.beegenius.backend.model.enums.Status;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRequestRepository extends MongoRepository<BookRequest, String> {
    List<BookRequest> findAllByBook_Owner_Id(String bookOwnerId);
    List<BookRequest> findAllByBook_Id(String bookId);

    boolean existsByBook_IdAndRequester_IdAndStatus(String bookId, String requesterId, Status status);
}
