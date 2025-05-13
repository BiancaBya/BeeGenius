package com.beegenius.backend.controller;

import com.beegenius.backend.model.Post;
import com.beegenius.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private static final Logger logger = LogManager.getLogger(PostController.class);

    @PostMapping
    public Post addPost(@RequestBody Post post) {
        logger.info("Adding new post with title: {}", post.getTitle());
        try {
            Post savedPost = postService.addPost(post);
            logger.info("Post added with ID: {}", savedPost.getId());
            return savedPost;
        } catch (Exception e) {
            logger.error("Error while adding post with title {}: {}", post.getTitle(), e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id) {
        logger.info("Deleting post with ID: {}", id);
        try {
            postService.deletePost(id);
            logger.info("Post deleted with ID: {}", id);
        } catch (Exception e) {
            logger.error("Error while deleting post with ID {}: {}", id, e.getMessage());
        }
    }

    @GetMapping
    public List<Post> getAllPosts() {
        logger.info("Fetching all posts");
        try {
            List<Post> posts = postService.getAllPosts();
            logger.info("Fetched posts: {}", posts.size());
            return posts;
        } catch (Exception e) {
            logger.error("Error while fetching all posts: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/search")
    public List<Post> searchPosts(@RequestParam String title) {
        logger.info("Searching posts by title: {}", title);
        try {
            List<Post> posts = postService.searchPostsByTitle(title);
            logger.info("Found posts with title: {}. Count: {}", title, posts.size());
            return posts;
        } catch (Exception e) {
            logger.error("Error while searching posts by title {}: {}", title, e.getMessage());
            throw e;
        }
    }

    @GetMapping("/filter")
    public List<Post> filterPosts(@RequestParam String tag) {
        logger.info("Filtering posts by tag: {}", tag);
        try {
            List<Post> posts = postService.filterPostsByTag(tag);
            logger.info("Found posts with tag: {}. Count: {}", tag, posts.size());
            return posts;
        } catch (Exception e) {
            logger.error("Error while filtering posts by tag {}: {}", tag, e.getMessage());
            throw e;
        }
    }

    @GetMapping("/{id}")
    public Post getPostById(@PathVariable String id) {
        logger.info("Fetching post with ID: {}", id);
        try {
            Post post = postService.getPostById(id);
            logger.info("Fetched post with ID: {}", id);
            return post;
        } catch (Exception e) {
            logger.error("Error while fetching post with ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

}
