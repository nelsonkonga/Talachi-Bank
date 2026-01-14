package com.schat.schatapi.repository;

import com.schat.schatapi.model.Transaction;
import com.schat.schatapi.model.User;
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

    Page<Transaction> findByStatus(Transaction.TransactionStatus status, Pageable pageable);

    List<Transaction> findByInitiatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Transaction> findByAmountGreaterThan(java.math.BigDecimal amount);

    // Custom query to find transactions waiting for a specific user's approval
    // (This would typically require a custom @Query, simplified here for demo)
}
