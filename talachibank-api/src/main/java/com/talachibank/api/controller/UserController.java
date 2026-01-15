package com.talachibank.api.controller;

import com.talachibank.api.model.User;
import com.talachibank.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private com.talachibank.api.repository.UserKeyPairRepository userKeyPairRepository;

    @GetMapping("/balance")
    public ResponseEntity<?> getBalance() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("balance", user.getBalance());
        response.put("accountNumber", user.getAccountNumber());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/keys")
    public ResponseEntity<java.util.List<com.talachibank.api.model.UserKeyPair>> getKeys() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);
        return ResponseEntity.ok(userKeyPairRepository.findByUser(user));
    }

    @PostMapping("/recharge")
    public ResponseEntity<?> recharge(@RequestBody Map<String, java.math.BigDecimal> request) {
        System.out.println("DEBUG: Recharge Request Received - Amount: " + request.get("amount"));
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        java.math.BigDecimal amount = request.get("amount");
        try {
            User updatedUser = userService.rechargeBalance(user, amount);
            Map<String, Object> response = new HashMap<>();
            response.put("balance", updatedUser.getBalance());
            response.put("message", "Recharge successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        try {
            userService.changePassword(user, oldPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
