package com.beegenius.backend.service;

import com.beegenius.backend.model.Post;
import com.beegenius.backend.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private static final Logger logger = LogManager.getLogger(PostService.class);

    public Post addPost(Post post) {
        logger.info("Adding new post with title: {}", post.getTitle());
        try {
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

    public List<Post> getAllPosts() {
        logger.info("Fetching all posts");
        try {
            return postRepository.findAll();
        } catch (Exception e) {
            logger.error("Error while fetching all posts: {}", e.getMessage());
            throw e;
        }
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
