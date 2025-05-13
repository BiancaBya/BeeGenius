package com.beegenius.backend.controller;

import com.beegenius.backend.model.Book;
import com.beegenius.backend.model.BookRequest;
import com.beegenius.backend.model.enums.Status;
import com.beegenius.backend.service.BookRequestService;
import com.beegenius.backend.service.BookService;
import com.beegenius.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/book-requests")
@RequiredArgsConstructor
public class BookRequestController {

    private static final Logger logger = LogManager.getLogger(BookRequestController.class);
    private final BookRequestService bookRequestService;
    private final UserService userService;
    private final BookService bookService;

    @PostMapping
    public ResponseEntity<BookRequest> createBookRequest(@RequestParam String bookId,
                                                         @RequestParam String requesterId) {
        logger.info("Entering createBookRequest - bookId={}, requesterId={}", bookId, requesterId);
        Optional<Book> requestedBook = bookService.getBookById(bookId);
        if (requestedBook.isPresent()) {
            if (bookRequestService.existsPendingRequest(bookId, requesterId)) {
                logger.info("Conflict: Pending request exists for bookId={}, requesterId={}", bookId, requesterId);
                logger.info("Exiting createBookRequest with status=409");
                return ResponseEntity.status(409).build();
            }
            BookRequest request = new BookRequest();
            request.setBook(requestedBook.get());
            request.setRequester(userService.findUserById(requesterId));
            request.setStatus(Status.PENDING);
            request.setDate(LocalDate.now());
            BookRequest saved = bookRequestService.addBookRequest(request);
            logger.info("BookRequest created successfully - id={}", saved.getId());
            logger.info("Exiting createBookRequest with status=200");
            return ResponseEntity.ok(saved);
        }
        logger.info("Book not found for id={}", bookId);
        logger.info("Exiting createBookRequest with status=404");
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<String> acceptRequest(@PathVariable String id) {
        logger.info("Entering acceptRequest - id={}", id);
        BookRequest request = bookRequestService.findBookRequestById(id);
        bookRequestService.acceptRequest(request);
        logger.info("BookRequest accepted successfully - id={}", id);
        logger.info("Exiting acceptRequest with status=200");
        return ResponseEntity.ok("Book request accepted successfully");
    }

    @PutMapping("/{id}/decline")
    public ResponseEntity<String> declineRequest(@PathVariable String id) {
        logger.info("Entering declineRequest - id={}", id);
        BookRequest request = bookRequestService.findBookRequestById(id);
        bookRequestService.declineRequest(request);
        logger.info("BookRequest declined successfully - id={}", id);
        logger.info("Exiting declineRequest with status=200");
        return ResponseEntity.ok("Book request declined successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<BookRequest>> getBookRequestsOfOwner(@PathVariable String id) {
        logger.info("Entering getBookRequestsOfOwner - ownerId={}", id);
        List<BookRequest> bookRequests = bookRequestService.getAllBookRequestsOfUser(id);
        if (bookRequests.isEmpty()) {
            logger.info("No BookRequests found for ownerId={}", id);
            logger.info("Exiting getBookRequestsOfOwner with status=204");
            return ResponseEntity.noContent().build();
        }
        logger.info("Found {} BookRequests for ownerId={}", bookRequests.size(), id);
        logger.info("Exiting getBookRequestsOfOwner with status=200");
        return ResponseEntity.ok(bookRequests);
    }
}


