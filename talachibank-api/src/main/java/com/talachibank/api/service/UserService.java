package com.talachibank.api.service;

import com.talachibank.api.model.User;
import com.talachibank.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private AuditService auditService;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public User rechargeBalance(User user, java.math.BigDecimal amount) {
        if (amount.compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Recharge amount must be positive");
        }
        user.setBalance(user.getBalance().add(amount));
        User savedUser = userRepository.save(user);

        auditService.logAction(user.getId(), "RECHARGE_BALANCE", "SUCCESS",
                "Recharged account with " + amount, "0.0.0.0");

        return savedUser;
    }

    public void changePassword(User user, String oldPassword, String newPassword) {
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }

        // Strong password validation (simple check for now)
        if (newPassword.length() < 8) {
            throw new RuntimeException("New password must be at least 8 characters long");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        auditService.logAction(user.getId(), "CHANGE_PASSWORD", "SUCCESS",
                "Password changed successfully", "0.0.0.0");
    }
}
