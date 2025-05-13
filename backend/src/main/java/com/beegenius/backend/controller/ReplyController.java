package com.beegenius.backend.controller;

import com.beegenius.backend.model.Reply;
import com.beegenius.backend.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/replies")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyService replyService;
    private static final Logger logger = LogManager.getLogger(ReplyController.class);

    @PostMapping("/to-post/{postId}")
    public Reply addReplyToPost(@PathVariable String postId,
                                @RequestBody Reply reply) {
        logger.info("Adding reply to post with ID: {}", postId);
        try {
            Reply result = replyService.addReplyToPost(postId, reply);
            logger.info("Reply added to post with ID: {}", postId);
            return result;
        } catch (Exception e) {
            logger.error("Error while adding reply to post with ID {}: {}", postId, e.getMessage());
            throw e;
        }
    }

    @PostMapping("/to-reply/{replyId}")
    public Reply addReplyToReply(@PathVariable String replyId,
                                 @RequestBody Reply reply) {
        logger.info("Adding reply to reply with ID: {}", replyId);
        try {
            Reply result = replyService.addReplyToReply(replyId, reply);
            logger.info("Reply added to reply with ID: {}", replyId);
            return result;
        } catch (Exception e) {
            logger.error("Error while adding reply to reply with ID {}: {}", replyId, e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public void deleteReply(@PathVariable String id) {
        logger.info("Deleting reply with ID: {}", id);
        try {
            replyService.deleteReply(id);
            logger.info("Reply deleted with ID: {}", id);
        } catch (Exception e) {
            logger.error("Error while deleting reply with ID {}: {}", id, e.getMessage());
        }
    }

    @GetMapping
    public List<Reply> getAllReplies() {
        logger.info("Fetching all replies");
        try {
            List<Reply> replies = replyService.getAllReplies();
            logger.info("Fetched replies: {}", replies.size());
            return replies;
        } catch (Exception e) {
            logger.error("Error while fetching all replies: {}", e.getMessage());
            throw e;
        }
    }
}
