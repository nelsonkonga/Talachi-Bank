package com.talachibank.api.service;

import com.talachibank.api.model.AuditLog;
import com.talachibank.api.model.User;
import com.talachibank.api.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(User user, String action, String transactionId, String details, String ipAddress) {
        AuditLog log = new AuditLog();
        log.setUserId(user != null ? user.getId() : null);
        log.setAction(action);
        log.setTransactionId(transactionId);
        log.setDetails(details);
        log.setIpAddress(ipAddress);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }
}
