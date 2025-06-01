package com.beegenius.backend.repository;

import com.beegenius.backend.model.Reply;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReplyRepository extends MongoRepository<Reply, String> {

    void deleteAllById(Iterable<? extends String> ids);
}
