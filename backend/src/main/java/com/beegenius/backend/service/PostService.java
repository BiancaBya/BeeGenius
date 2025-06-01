package com.beegenius.backend.service;

import com.beegenius.backend.model.Post;
import com.beegenius.backend.model.Reply;
import com.beegenius.backend.model.dto.PostDto;
import com.beegenius.backend.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private static final Logger logger = LogManager.getLogger(PostService.class);

    public Post addPost(Post post) {
        logger.info("Adding new post with title: {}", post.getTitle());
        try {
            post.setDate(LocalDate.now());
            Post savedPost = postRepository.save(post);
            logger.info("Post added successfully with ID: {}", savedPost.getId());
            return savedPost;
        } catch (Exception e) {
            logger.error("Error while adding post with title {}: {}", post.getTitle(), e.getMessage());
            throw e;
        }
    }

    public void deletePost(String postId) {
        logger.info("Deleting post with ID: {}", postId);
        try {
            postRepository.deleteById(postId);
            logger.info("Post deleted successfully with ID: {}", postId);
        } catch (Exception e) {
            logger.error("Error while deleting post with ID {}: {}", postId, e.getMessage());
        }
    }

    private String getTimeAgo(LocalDate date) {
        LocalDate today = LocalDate.now();
        long days = ChronoUnit.DAYS.between(date, today);

        if (days == 0) return "today";
        if (days == 1) return "yesterday";
        if (days < 30) return days + " days ago";
        if (days < 365) return (days / 30) + " months ago";
        return (days / 365) + " years ago";
    }

    private int countRepliesRecursively(List<Reply> replies) {
        if (replies == null || replies.isEmpty()) return 0;

        int count = replies.size();
        for (Reply reply : replies) {
            count += countRepliesRecursively(reply.getReplies());
        }
        return count;
    }


    public List<PostDto> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return posts.stream().map(post -> PostDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .date(post.getDate())
                .tags(post.getTags())
                .user(post.getUser())
                .repliesCount(countRepliesRecursively(post.getReplies()))

                .timeAgo(getTimeAgo(post.getDate()))
                .build()
        ).toList();
    }


    public List<Post> searchPostsByTitle(String title) {
        logger.info("Searching posts by title containing: {}", title);
        try {
            return postRepository.findByTitleContainingIgnoreCase(title);
        } catch (Exception e) {
            logger.error("Error while searching posts by title {}: {}", title, e.getMessage());
            throw e;
        }
    }

    public List<Post> filterPostsByTag(String tag) {
        logger.info("Filtering posts by tag: {}", tag);
        try {
            return postRepository.findByTagsContaining(tag);
        } catch (Exception e) {
            logger.error("Error while filtering posts by tag {}: {}", tag, e.getMessage());
            throw e;
        }
    }

    public Post getPostById(String id) {
        logger.info("Fetching post with ID: {}", id);
        try {
            return postRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        } catch (Exception e) {
            logger.error("Error while fetching post with ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

}
