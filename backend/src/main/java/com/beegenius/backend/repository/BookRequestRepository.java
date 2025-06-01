package com.beegenius.backend.repository;

import com.beegenius.backend.model.BookRequest;
import com.beegenius.backend.model.enums.Status;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRequestRepository extends MongoRepository<BookRequest, String> {

    @Aggregation(pipeline = {
            "{ $lookup: { from: 'books', localField: 'book.$id', foreignField: '_id', as: 'bookDoc' } }",
            "{ $unwind: '$bookDoc' }",
            "{ $match: { 'bookDoc.owner.$id': ?0, status: 'PENDING' } }"
    })
    List<BookRequest> findAllByBookOwnerId(ObjectId id);
    List<BookRequest> findAllByBook_Id(String bookId);
    List<BookRequest> findAllByRequesterId(String requesterId);

    boolean existsByBook_IdAndRequester_IdAndStatus(String bookId, String requesterId, Status status);
}
