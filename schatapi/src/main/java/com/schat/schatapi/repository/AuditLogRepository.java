package com.schat.schatapi.repository;

import com.schat.schatapi.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByTransactionId(String transactionId);

    List<AuditLog> findByUserId(Long userId);
}
