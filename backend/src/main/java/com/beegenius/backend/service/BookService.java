package com.beegenius.backend.service;

import com.beegenius.backend.model.Book;
import com.beegenius.backend.model.enums.Tags;
import com.beegenius.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {

    private static final Logger logger = LogManager.getLogger(BookService.class);
    private final BookRepository bookRepository;

    public Book addBook(Book book) {
        logger.info("Adding new book with title: {}", book.getTitle());
        try {
            Book savedBook = bookRepository.save(book);
            logger.info("Book added successfully with ID: {}", savedBook.getId());
            return savedBook;
        } catch (Exception e) {
            logger.error("Error while adding book with title {}: {}", book.getTitle(), e.getMessage());
            throw e;
        }
    }

    public Optional<Book> getBookById(String id) {
        logger.info("Fetching book with ID: {}", id);
        try {
            return bookRepository.findById(id);
        } catch (Exception e) {
            logger.error("Error while fetching book with ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

    public List<Book> getAllBooks() {
        logger.info("Fetching all books");
        try {
            return bookRepository.findAll();
        } catch (Exception e) {
            logger.error("Error while fetching all books: {}", e.getMessage());
            throw e;
        }
    }

    public List<Book> getBooksWithoutApprovedRequests() {
        logger.info("Fetching books without approved requests");
        try {
            return bookRepository.findBooksWithoutApprovedRequests();
        } catch (Exception e) {
            logger.error("Error fetching books without approved requests: {}", e.getMessage());
            throw e;
        }
    }

    public void deleteBook(String bookId) {
        logger.info("Deleting book with ID: {}", bookId);
        try {
            Optional<Book> bookOpt = bookRepository.findById(bookId);

            if (bookOpt.isPresent()) {
                bookRepository.deleteById(bookId);
                logger.info("Book deleted successfully with ID: {}", bookId);
            } else {
                logger.warn("Book not found with ID: {}", bookId);
            }

        } catch (Exception e) {
            logger.error("Error while deleting book with ID {}: {}", bookId, e.getMessage());
            throw e;
        }
    }

    public List<Book> filterBooksByTags(Tags tag) {
        logger.info("Filtering books by tag: {}", tag);
        try {
            return bookRepository.findByTagsContaining(tag);
        } catch (Exception e) {
            logger.error("Error while filtering books by tag {}: {}", tag, e.getMessage());
            throw e;
        }
    }

    public List<Book> searchBooksByTitle(String title) {
        logger.info("Searching books by title containing: {}", title);
        try {
            return bookRepository.findBookByTitleContaining(title);
        } catch (Exception e) {
            logger.error("Error while searching books by title {}: {}", title, e.getMessage());
            throw e;
        }
    }
}
