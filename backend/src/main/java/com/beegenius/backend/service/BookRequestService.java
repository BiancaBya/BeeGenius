package com.beegenius.backend.service;

import com.beegenius.backend.model.BookRequest;
import com.beegenius.backend.model.enums.Status;
import com.beegenius.backend.repository.BookRequestRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookRequestService {
    private static final Logger logger = LoggerFactory.getLogger(BookRequestService.class);
    private final BookRequestRepository bookRequestRepository;

    public BookRequest addBookRequest(BookRequest bookRequest) {
        logger.info("Entering addBookRequest with bookRequest={} ", bookRequest);
        try {
            BookRequest saved = bookRequestRepository.save(bookRequest);
            logger.info("Successfully added BookRequest with id={}", saved.getId());
            logger.info("Exiting addBookRequest");
            return saved;
        } catch (Exception e) {
            logger.error("Error in addBookRequest for bookRequest={} ", bookRequest, e);
            throw e;
        }
    }

    public List<BookRequest> getAllBookRequestsOfUser(String userId) {
        logger.info("Entering getAllBookRequestsOfUser for userId={} ", userId);
        try {
            List<BookRequest> list = bookRequestRepository.findAllByBook_Owner_Id(userId);
            logger.info("Found {} requests for userId={}", list.size(), userId);
            logger.info("Exiting getAllBookRequestsOfUser");
            return list;
        } catch (Exception e) {
            logger.error("Error in getAllBookRequestsOfUser for userId={} ", userId, e);
            throw e;
        }
    }

    public Optional<BookRequest> getBookRequestById(String bookRequestId) {
        logger.info("Entering getBookRequestById with bookRequestId={} ", bookRequestId);
        try {
            Optional<BookRequest> result = bookRequestRepository.findById(bookRequestId);
            if (result.isPresent()) {
                logger.info("BookRequest found: id={} ", bookRequestId);
            } else {
                logger.info("No BookRequest found for id={} ", bookRequestId);
            }
            logger.info("Exiting getBookRequestById");
            return result;
        } catch (Exception e) {
            logger.error("Error in getBookRequestById for id={} ", bookRequestId, e);
            throw e;
        }
    }

    public boolean existsPendingRequest(String bookId, String requesterId) {
        logger.info("Entering existsPendingRequest for bookId={} and requesterId={} ", bookId, requesterId);
        try {
            boolean exists = bookRequestRepository.existsByBook_IdAndRequester_IdAndStatus(
                    bookId, requesterId, Status.PENDING);
            logger.info("Pending request exists: {} for bookId={}, requesterId={}", exists, bookId, requesterId);
            logger.info("Exiting existsPendingRequest");
            return exists;
        } catch (Exception e) {
            logger.error("Error in existsPendingRequest for bookId={} and requesterId={} ", bookId, requesterId, e);
            throw e;
        }
    }

    public void acceptRequest(BookRequest bookRequest) {
        logger.info("Entering acceptRequest for requestId={} ", bookRequest.getId());
        try {
            // Approve selected request
            bookRequest.setStatus(Status.APPROVED);
            bookRequestRepository.save(bookRequest);
            logger.info("Approved BookRequest id={} for bookId={} by requesterId={}",
                    bookRequest.getId(), bookRequest.getBook().getId(), bookRequest.getRequester().getId());

            // Decline other requests for the same book
            List<BookRequest> otherRequests = bookRequestRepository.findAllByBook_Id(bookRequest.getBook().getId());
            for (BookRequest other : otherRequests) {
                if (!other.getId().equals(bookRequest.getId())) {
                    other.setStatus(Status.DECLINED);
                    bookRequestRepository.save(other);
                    logger.info("Declined BookRequest id={} for bookId={} ", other.getId(), bookRequest.getBook().getId());
                }
            }

            logger.info("Exiting acceptRequest");
        } catch (Exception e) {
            logger.error("Error in acceptRequest for requestId={} ", bookRequest.getId(), e);
            throw e;
        }
    }

    public void declineRequest(BookRequest bookRequest) {
        logger.info("Entering declineRequest for requestId={} ", bookRequest.getId());
        try {
            bookRequest.setStatus(Status.DECLINED);
            bookRequestRepository.save(bookRequest);
            logger.info("Declined BookRequest id={} for bookId={} ",
                    bookRequest.getId(), bookRequest.getBook().getId());
            logger.info("Exiting declineRequest");
        } catch (Exception e) {
            logger.error("Error in declineRequest for requestId={} ", bookRequest.getId(), e);
            throw e;
        }
    }

    public BookRequest findBookRequestById(String id) {
        logger.info("Entering findBookRequestById with id={} ", id);
        try {
            BookRequest found = bookRequestRepository.findById(id).orElse(null);
            if (found != null) {
                logger.info("BookRequest found in findBookRequestById id={} ", id);
            } else {
                logger.info("No BookRequest found in findBookRequestById for id={} ", id);
            }
            logger.info("Exiting findBookRequestById");
            return found;
        } catch (Exception e) {
            logger.error("Error in findBookRequestById for id={} ", id, e);
            throw e;
        }
    }
}



