package com.beegenius.backend.controller;

import com.beegenius.backend.model.Book;
import com.beegenius.backend.model.enums.Tags;
import com.beegenius.backend.service.BookService;
import com.beegenius.backend.service.SupabaseStorageService;
import com.beegenius.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("api/books")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;
    private final UserService userService;
    private static final Logger logger = LogManager.getLogger(BookController.class);
    private final SupabaseStorageService storageService;
    private static final String IMAGE_UPLOAD_DIR = "uploads/book_images";

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Book> addBook(@RequestParam String title,
                                        @RequestParam String author,
                                        @RequestParam List<Tags> tags,
                                        @RequestParam MultipartFile imageFile,
                                        @RequestParam String userId) throws IOException {
        logger.info("Adding new book with title: {}", title);
        try {

            String imageUrl = storageService.uploadFile(imageFile, "book_images");

            Book book = new Book();
            book.setTitle(title);
            book.setAuthor(author);
            book.setTags(tags);
            book.setPhotoPath(imageUrl);
            book.setOwner(userService.findUserById(userId));

            Book savedBook = bookService.addBook(book);
            logger.info("Book added with ID: {}", savedBook.getId());
            return ResponseEntity.ok(savedBook);
        } catch (Exception e) {
            logger.error("Error while adding book with title {}: {}", title, e.getMessage());
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        logger.info("Fetching all books");
        try {
            List<Book> books = bookService.getBooksWithoutApprovedRequests();
            logger.info("Fetched books: {}", books.size());
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            logger.error("Error while fetching all books: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        logger.info("Fetching book with ID: {}", id);
        try {
            Optional<Book> book = bookService.getBookById(id);
            logger.info("Fetched book with ID: {}", id);
            return book.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error while fetching book with ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBook(@RequestParam String title) {
        logger.info("Searching books by title: {}", title);
        try {
            List<Book> books = bookService.searchBooksByTitle(title);
            logger.info("Found books with title: {}. Count: {}", title, books.size());
            return books.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(books);
        } catch (Exception e) {
            logger.error("Error while searching books by title {}: {}", title, e.getMessage());
            throw e;
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Book>> filterBook(@RequestParam Tags tag) {
        logger.info("Filtering books by tag: {}", tag);
        try {
            List<Book> books = bookService.filterBooksByTags(tag);
            logger.info("Found books with tag: {}. Count: {}", tag, books.size());
            return books.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(books);
        } catch (Exception e) {
            logger.error("Error while filtering books by tag {}: {}", tag, e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable String id) {
        logger.info("Deleting book with ID: {}", id);
        try {
            Optional<Book> bookOpt = bookService.getBookById(id);
            if (bookOpt.isEmpty()) {
                logger.warn("Book not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }

            Book book = bookOpt.get();

            if (book.getPhotoPath() != null && !book.getPhotoPath().isBlank()) {
                String filePath = extractPathFromUrl(book.getPhotoPath());
                storageService.deleteFile(filePath);
            }
            bookService.deleteBook(id);

            logger.info("Book deleted with ID: {}", id);
            return ResponseEntity.ok("Book deleted successfully");

        } catch (Exception e) {
            logger.error("Error while deleting book with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(500).body("Internal error while deleting book");
        }
    }

    private String extractPathFromUrl(String fullUrl) {
        String[] parts = fullUrl.split("/object/public/");
        return parts.length > 1 ? parts[1] : "";
    }
}
