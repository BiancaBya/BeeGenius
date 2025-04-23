package com.beegenius.backend.service;

import com.beegenius.backend.model.Post;
import com.beegenius.backend.model.Reply;
import com.beegenius.backend.repository.PostRepository;
import com.beegenius.backend.repository.ReplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final PostRepository postRepository;

    public Reply addReplyToReply(String parentReplyId, Reply newReply) {
        Reply parent = replyRepository.findById(parentReplyId)
                .orElseThrow(() -> new RuntimeException("Parent reply not found"));

        Reply savedReply = replyRepository.save(newReply);

        parent.getReplies().add(savedReply);
        replyRepository.save(parent);
        return savedReply;
    }

    public Reply addReplyToPost(String postId, Reply newReply) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Reply savedReply = replyRepository.save(newReply);  // 1. Salvezi reply-ul nou
        post.getReplies().add(savedReply);                  // 2. Îl adaugi în lista postului
        postRepository.save(post);                          // 3. Salvezi modificarea postului

        return savedReply;
    }


    public void deleteReply(String replyId) {
        replyRepository.deleteById(replyId);
    }

    public List<Reply> getAllReplies() {
        return replyRepository.findAll();
    }
}
