package com.talachibank.api.controller;

import com.talachibank.api.model.Transaction;
import com.talachibank.api.model.User;
import com.talachibank.api.service.TransactionService;
import com.talachibank.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*") // Allow localhost for demo
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService; // To get current user

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction tx) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);
        if (user == null)
            return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(transactionService.createTransaction(tx, user));
    }

    @PostMapping("/{id}/sign")
    public ResponseEntity<Transaction> signTransaction(
            @PathVariable UUID id,
            @RequestParam Long keyId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);
        return ResponseEntity.ok(transactionService.signTransaction(id, user, keyId));
    }

    @GetMapping("/{id}/verify")
    public ResponseEntity<Boolean> verifyTransaction(@PathVariable UUID id) {
        return ResponseEntity.ok(transactionService.verifyTransaction(id));
    }

    @PostMapping("/{id}/execute")
    public ResponseEntity<Transaction> executeTransaction(@PathVariable UUID id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);
        return ResponseEntity.ok(transactionService.executeTransaction(id, user));
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username);
        return ResponseEntity.ok(transactionService.getUserTransactions(user));
    }
}
