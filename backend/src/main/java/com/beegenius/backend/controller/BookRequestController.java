package com.beegenius.backend.controller;

import com.beegenius.backend.model.Book;
import com.beegenius.backend.model.BookRequest;
import com.beegenius.backend.model.enums.Status;
import com.beegenius.backend.service.BookRequestService;
import com.beegenius.backend.service.BookService;
import com.beegenius.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/book-requests")
@RequiredArgsConstructor
public class BookRequestController {
    private final BookRequestService bookRequestService;
    private final UserService userService;
    private final BookService bookService;

    @PostMapping
    public ResponseEntity<BookRequest> createBookRequest(@RequestParam String bookId,
                                                         @RequestParam String requesterId) {
        BookRequest request = new BookRequest();
        Optional<Book> requestedBook = bookService.getBookById(bookId);
        if (requestedBook.isPresent()) {

            if (bookRequestService.existsPendingRequest(bookId, requesterId)) {
                return ResponseEntity.status(409).build(); // Conflict - deja există
            }

            request.setBook(requestedBook.get());
            request.setRequester(userService.findUserById(requesterId));
            request.setStatus(Status.PENDING);
            request.setDate(LocalDate.now());

            return ResponseEntity.ok(bookRequestService.addBookRequest(request));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<String> acceptRequest(@PathVariable String id) {
        BookRequest request = bookRequestService.findBookRequestById(id);
        bookRequestService.acceptRequest(request);
        return ResponseEntity.ok("Book request accepted successfully");
    }

    @PutMapping("/{id}/decline")
    public ResponseEntity<String> declineRequest(@PathVariable String id) {
        BookRequest request = bookRequestService.findBookRequestById(id);
        bookRequestService.declineRequest(request);
        return ResponseEntity.ok("Book request declined successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<BookRequest>> getBookRequestsOfOwner(@PathVariable String id) {
        List<BookRequest> bookRequests = bookRequestService.getAllBookRequestsOfUser(id);
        return bookRequests.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(bookRequests);
    }
}
