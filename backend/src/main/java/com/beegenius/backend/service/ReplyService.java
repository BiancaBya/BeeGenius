package com.beegenius.backend.service;

import com.beegenius.backend.model.Post;
import com.beegenius.backend.model.Reply;
import com.beegenius.backend.repository.PostRepository;
import com.beegenius.backend.repository.ReplyRepository;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReplyService {

    private static final Logger logger = LogManager.getLogger(ReplyService.class);

    private final ReplyRepository replyRepository;
    private final PostRepository postRepository;

    public Reply addReplyToReply(String parentReplyId, Reply newReply) {
        logger.info("Adding reply to reply with parentReplyId: {}", parentReplyId);
        try {
            Reply parent = replyRepository.findById(parentReplyId)
                    .orElseThrow(() -> new RuntimeException("Parent reply not found"));

            Reply savedReply = replyRepository.save(newReply);

            parent.getReplies().add(savedReply);
            replyRepository.save(parent);
            logger.info("Reply added successfully to parent reply with ID: {}", parentReplyId);
            return savedReply;
        } catch (Exception e) {
            logger.error("Error while adding reply to reply with ID {}: {}", parentReplyId, e.getMessage());
            throw e;
        }
    }

    public Reply addReplyToPost(String postId, Reply newReply) {
        logger.info("Adding reply to post with postId: {}", postId);
        try {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found"));

            Reply savedReply = replyRepository.save(newReply);
            post.getReplies().add(savedReply);
            postRepository.save(post);

            logger.info("Reply added successfully to post with ID: {}", postId);
            return savedReply;
        } catch (Exception e) {
            logger.error("Error while adding reply to post with ID {}: {}", postId, e.getMessage());
            throw e;
        }
    }

    public void deleteReply(String replyId) {
        logger.info("Deleting reply with ID: {}", replyId);
        try {
            replyRepository.deleteById(replyId);
            logger.info("Reply deleted successfully with ID: {}", replyId);
        } catch (Exception e) {
            logger.error("Error while deleting reply with ID {}: {}", replyId, e.getMessage());
        }
    }

    public List<Reply> getAllReplies() {
        logger.info("Fetching all replies");
        try {
            return replyRepository.findAll();
        } catch (Exception e) {
            logger.error("Error while fetching all replies: {}", e.getMessage());
            throw e;
        }
    }
}
