package com.beegenius.backend.controller;

import com.beegenius.backend.model.Book;
import com.beegenius.backend.model.enums.Tags;
import com.beegenius.backend.service.BookService;
import com.beegenius.backend.service.UserService;
import lombok.RequiredArgsConstructor;
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

    private static final String IMAGE_UPLOAD_DIR = "uploads/book_images";

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Book> addBook(@RequestParam String title,
                                        @RequestParam String author,
                                        @RequestParam List<Tags> tags,
                                        @RequestParam MultipartFile imageFile,
                                        @RequestParam String userId) throws IOException {


        String filename = UUID.randomUUID() + "" + imageFile.getOriginalFilename();
        Path imagePath = Paths.get(IMAGE_UPLOAD_DIR, filename);

        Files.write(imagePath, imageFile.getBytes());

        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setTags(tags);
        book.setPhotoPath(imagePath.toString());
        book.setOwner(userService.findUserById(userId));

        return ResponseEntity.ok(bookService.addBook(book));
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        Optional<Book> book = bookService.getBookById(id);
        return book.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBook(@RequestParam String title) {
        List<Book> foundBooks = bookService.searchBooksByTitle(title);
        return foundBooks.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(foundBooks);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Book>> filterBook(@RequestParam Tags tag) {
        List<Book> foundBooks = bookService.filterBooksByTags(tag);
        return foundBooks.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(foundBooks);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable String id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok("Book deleted successfully");
    }
}
