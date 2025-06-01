package com.beegenius.backend.service;

import com.beegenius.backend.model.Post;
import com.beegenius.backend.model.Reply;
import com.beegenius.backend.repository.PostRepository;
import com.beegenius.backend.repository.ReplyRepository;
import com.mongodb.DBRef;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
        ObjectId mainId = new ObjectId(replyId);

        // 1. Obține toate reply-urile de șters (inclusiv copii)
        Set<String> allReplyIds = new HashSet<>();
        collectReplyAndChildren(replyId, allReplyIds);

        // 2. Șterge din colecția de replies
        replyRepository.deleteAllById(allReplyIds);

        // 3. Scoate din toate postările aceste reply-uri
        List<Post> allPosts = postRepository.findAll();

        for (Post post : allPosts) {
            List<Reply> updatedReplies = post.getReplies().stream()
                    .filter(ref -> !allReplyIds.contains(ref.getId().toString()))
                    .collect(Collectors.toList());

            if (updatedReplies.size() != post.getReplies().size()) {
                post.setReplies(updatedReplies);
                postRepository.save(post);
            }
        }
    }

    // 🔁 Funcție recursivă care adună toate reply-urile de șters
    private void collectReplyAndChildren(String replyId, Set<String> collectedIds) {
        if (collectedIds.contains(replyId)) return;

        collectedIds.add(replyId);
        Optional<Reply> replyOpt = replyRepository.findById(replyId);
        if (replyOpt.isEmpty()) return;

        Reply reply = replyOpt.get();
        if (reply.getReplies() != null) {
            for (Reply childRef : reply.getReplies()) {
                String childId = childRef.getId().toString();
                collectReplyAndChildren(childId, collectedIds);
            }
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
