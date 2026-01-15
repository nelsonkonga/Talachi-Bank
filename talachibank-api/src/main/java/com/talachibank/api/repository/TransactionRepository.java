package com.talachibank.api.repository;

import com.talachibank.api.model.Transaction;
import com.talachibank.api.model.TransactionStatus;
import com.talachibank.api.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    List<Transaction> findByInitiatedBy(User user);

    List<Transaction> findByInitiatedByOrToAccountNumberOrderByInitiatedAtDesc(User user, String toAccountNumber);

    Page<Transaction> findByStatus(TransactionStatus status, Pageable pageable);

    List<Transaction> findByInitiatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Transaction> findByAmountGreaterThan(java.math.BigDecimal amount);

    // Custom query to find transactions waiting for a specific user's approval
    // (This would typically require a custom @Query, simplified here for demo)
}
