package com.talachibank.api.service;

import com.talachibank.api.model.Transaction;
import com.talachibank.api.model.TransactionStatus;
import com.talachibank.api.model.User;
import com.talachibank.api.model.UserKeyPair;
import com.talachibank.api.repository.TransactionRepository;
import com.talachibank.api.repository.UserKeyPairRepository;
import com.talachibank.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.NonNull;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserKeyPairRepository userKeyPairRepository;

    @Autowired
    private SDitHTokenService sdithService;

    @Autowired
    private AuditService auditService;

    @Transactional
    public Transaction createTransaction(Transaction tx, User user) {
        // 1. Validate sufficient funds
        if (user.getBalance().compareTo(tx.getAmount()) < 0) {
            throw new RuntimeException("Insufficient funds. Available: " + user.getBalance());
        }

        // 2. Validate beneficiary exists
        userRepository.findByAccountNumber(tx.getToAccountNumber())
                .orElseThrow(() -> new RuntimeException("Beneficiary account not found: " + tx.getToAccountNumber()));

        // 3. Prevent self-transfer
        if (tx.getToAccountNumber().equals(user.getAccountNumber())) {
            throw new RuntimeException("Self-transfers are not allowed.");
        }

        tx.setInitiatedBy(user);
        tx.setFromAccountNumber(user.getAccountNumber());
        tx.setStatus(TransactionStatus.PENDING);
        tx.setInitiatedAt(LocalDateTime.now());

        Transaction savedTx = transactionRepository.save(tx);

        auditService.logAction(user.getId(), "CREATE_TRANSACTION", savedTx.getTransactionId().toString(),
                "Created transaction to " + tx.getToAccountNumber() + " amount " + tx.getAmount(), "0.0.0.0");

        return savedTx;
    }

    @Transactional
    public Transaction executeTransaction(@NonNull UUID transactionId, @NonNull User user) {
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (tx.getStatus() != TransactionStatus.SIGNED) {
            throw new IllegalStateException("Transaction must be SIGNED before execution.");
        }

        if (!tx.getSignatureVerified()) {
            throw new IllegalStateException("Transaction signature not verified.");
        }

        // Final check on funds (in case balance changed since creation)
        User sender = tx.getInitiatedBy();
        if (sender.getBalance().compareTo(tx.getAmount()) < 0) {
            tx.setStatus(TransactionStatus.FAILED);
            transactionRepository.save(tx);
            throw new RuntimeException("Insufficient funds for execution.");
        }

        User recipient = userRepository.findByAccountNumber(tx.getToAccountNumber())
                .orElseThrow(() -> new RuntimeException("Recipient account no longer exists."));

        // Atomic update
        java.math.BigDecimal oldSenderBalance = sender.getBalance();
        java.math.BigDecimal oldRecipientBalance = recipient.getBalance();

        sender.setBalance(sender.getBalance().subtract(tx.getAmount()));
        recipient.setBalance(recipient.getBalance().add(tx.getAmount()));

        userRepository.save(sender);
        userRepository.save(recipient);

        tx.setStatus(TransactionStatus.EXECUTED);
        tx.setExecutedAt(LocalDateTime.now());
        Transaction executedTx = transactionRepository.save(tx);

        System.out.println("DEBUG: Transaction Execution - " + tx.getTransactionId());
        System.out.println("DEBUG: Sender (" + sender.getAccountNumber() + ") Balance: " + oldSenderBalance + " -> "
                + sender.getBalance());
        System.out.println("DEBUG: Recipient (" + recipient.getAccountNumber() + ") Balance: " + oldRecipientBalance
                + " -> " + recipient.getBalance());

        auditService.logAction(user.getId(), "EXECUTE_TRANSACTION", transactionId.toString(),
                "Funds transferred from " + tx.getFromAccountNumber() + " to " + tx.getToAccountNumber() + " amount "
                        + tx.getAmount(),
                "0.0.0.0");

        return executedTx;
    }

    public BigDecimal getUserBalance(User user) {
        return user.getBalance();
    }

    @Transactional
    public Transaction signTransaction(@NonNull UUID transactionId, @NonNull User user, @NonNull Long keyId) {
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!tx.getInitiatedBy().getId().equals(user.getId())) {
            // For simple signing. In real app might be an approver.
            throw new RuntimeException("Not authorized to sign this transaction");
        }

        UserKeyPair keyPair = userKeyPairRepository.findById(keyId)
                .orElseThrow(() -> new RuntimeException("Key Pair not found"));

        if (!keyPair.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Key Pair does not belong to user");
        }

        // 1. Compute Hash of transaction data
        String dataToSign = buildDataString(tx);
        String hash = computeHash(dataToSign);
        tx.setTransactionHash(hash);

        // 2. Sign Hash
        byte[] signature = sdithService.signTransaction(hash, keyPair.getPrivateKeyEncrypted()); // Assuming encrypted
                                                                                                 // is actually raw for
                                                                                                 // demo or decrypted in
                                                                                                 // service
        tx.setSdithSignature(signature);
        tx.setSignatureLevel(keyPair.getSecurityLevel());
        tx.setStatus(TransactionStatus.SIGNED);
        tx.setSignatureVerified(true);

        // Update key usage
        keyPair.setLastUsedAt(LocalDateTime.now());
        keyPair.setUsageCount(keyPair.getUsageCount() + 1);
        userKeyPairRepository.save(keyPair);

        Transaction signedTx = transactionRepository.save(tx);

        auditService.logAction(user.getId(), "SIGN_TRANSACTION", transactionId.toString(),
                "Signed with KeyID " + keyId + " (SDitH Level " + keyPair.getSecurityLevel() + ")", "0.0.0.0");

        return signedTx;
    }

    public boolean verifyTransaction(@NonNull UUID transactionId) {
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (tx.getSdithSignature() == null)
            return false;

        // Find public key (conceptually we should store which key ID was used on the
        // tx,
        // but for now we'll assume we look it up or it's attached.
        // For verify logic we might need the public key bytes stored on TX or similar.
        // Simplified: Fetch user's active key or the one matching signature?
        // Let's assume user has one active key for simplicity or iterate.)

        // In this demo, we can't easily retrieve the exact public key without storing
        // keyID on TX.
        // Let's assume we use the user's current active key of same level.
        User signer = tx.getInitiatedBy();
        List<UserKeyPair> keys = userKeyPairRepository.findByUserAndStatus(signer, UserKeyPair.KeyStatus.ACTIVE);

        for (UserKeyPair key : keys) {
            if (sdithService.verifyTransaction(tx.getTransactionHash(), tx.getSdithSignature(), key.getPublicKey(),
                    key.getSyndrome())) {
                return true;
            }
        }
        return false;
    }

    public List<Transaction> getUserTransactions(User user) {
        List<Transaction> transactions = transactionRepository
                .findByInitiatedByOrToAccountNumberOrderByInitiatedAtDesc(user, user.getAccountNumber());
        return transactions != null ? transactions : java.util.Collections.emptyList();
    }

    private String buildDataString(Transaction tx) {
        return String.format("{id:%s,amount:%s,from:%s,to:%s}",
                tx.getTransactionId(), tx.getAmount(), tx.getFromAccountNumber(), tx.getToAccountNumber());
    }

    private String computeHash(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA3-256");
            byte[] encodedhash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encodedhash);
        } catch (Exception e) {
            throw new RuntimeException("Hash failed", e);
        }
    }
}
