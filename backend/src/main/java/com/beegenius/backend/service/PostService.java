package com.beegenius.backend.service;

import com.beegenius.backend.model.Post;
import com.beegenius.backend.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public Post addPost(Post post) {
        return postRepository.save(post);
    }

    public void deletePost(String postId) {
        postRepository.deleteById(postId);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> searchPostsByTitle(String title) {
        return postRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Post> filterPostsByTag(String tag) {
        return postRepository.findByTagsContaining(tag);
    }
}
