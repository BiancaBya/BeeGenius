package com.beegenius.backend.service;

import com.beegenius.backend.model.BookRequest;
import com.beegenius.backend.model.enums.Status;
import com.beegenius.backend.repository.BookRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookRequestService {
    private final BookRequestRepository bookRequestRepository;

    public BookRequest addBookRequest(BookRequest bookRequest) {
        return bookRequestRepository.save(bookRequest);
    }

    public List<BookRequest> getAllBookRequestsOfUser(String userId) {
        return bookRequestRepository.findAllByBook_Owner_Id(userId);
    }

    public Optional<BookRequest> getBookRequestById(String bookRequestId) {
        return bookRequestRepository.findById(bookRequestId);
    }

    public boolean existsPendingRequest(String bookId, String requesterId) {
        return bookRequestRepository.existsByBook_IdAndRequester_IdAndStatus(bookId, requesterId, Status.PENDING);
    }

    public void acceptRequest(BookRequest bookRequest) {

        bookRequest.setStatus(Status.APPROVED);
        bookRequestRepository.save(bookRequest);

        List<BookRequest> otherRequests = bookRequestRepository.findAllByBook_Id(bookRequest.getBook().getId());

        for (BookRequest other : otherRequests) {
            if (!other.getId().equals(bookRequest.getId())) {
                other.setStatus(Status.DECLINED);
                bookRequestRepository.save(other);
            }
        }
    }

    public void declineRequest(BookRequest bookRequest) {
        bookRequest.setStatus(Status.DECLINED);
        bookRequestRepository.save(bookRequest);
    }

    public BookRequest findBookRequestById(String id) {
        return bookRequestRepository.findById(id).orElse(null);
    }
}
