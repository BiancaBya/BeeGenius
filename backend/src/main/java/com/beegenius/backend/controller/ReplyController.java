package com.beegenius.backend.controller;

import com.beegenius.backend.model.Reply;
import com.beegenius.backend.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/replies")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyService replyService;

    @PostMapping("/to-post/{postId}")
    public Reply addReplyToPost(@PathVariable String postId,
                                @RequestBody Reply reply) {
        return replyService.addReplyToPost(postId, reply);
    }

    @PostMapping("/to-reply/{replyId}")
    public Reply addReplyToReply(@PathVariable String replyId,
                                 @RequestBody Reply reply) {
        return replyService.addReplyToReply(replyId, reply);
    }

    @DeleteMapping("/{id}")
    public void deleteReply(@PathVariable String id) {
        replyService.deleteReply(id);
    }

    @GetMapping
    public List<Reply> getAllReplies() {
        return replyService.getAllReplies();
    }
}
