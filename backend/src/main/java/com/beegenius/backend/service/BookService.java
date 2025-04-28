package com.beegenius.backend.service;

import com.beegenius.backend.model.Book;
import com.beegenius.backend.model.enums.Tags;
import com.beegenius.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public Optional<Book> getBookById(String id) { return bookRepository.findById(id); }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public void deleteBook(String bookId) {
        bookRepository.deleteById(bookId);
    }

    public List<Book> filterBooksByTags(Tags tag){
        return bookRepository.findByTagsContaining(tag);
    }

    public List<Book> searchBooksByTitle(String title){
        return bookRepository.findBookByTitleContaining(title);
    }
}
