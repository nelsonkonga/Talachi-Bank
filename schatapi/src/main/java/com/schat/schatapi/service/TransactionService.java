package com.schat.schatapi.service;

import com.schat.schatapi.model.Transaction;
import com.schat.schatapi.model.User;
import com.schat.schatapi.model.UserKeyPair;
import com.schat.schatapi.repository.TransactionRepository;
import com.schat.schatapi.repository.UserKeyPairRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private UserKeyPairRepository userKeyPairRepository;

    @Autowired
    private SDitHTokenService sdithService;

    @Autowired
    private AuditService auditService;

    @Transactional
    public Transaction createTransaction(Transaction tx, User user) {
        tx.setInitiatedBy(user);
        tx.setStatus(Transaction.TransactionStatus.PENDING);
        tx.setInitiatedAt(LocalDateTime.now());

        Transaction savedTx = transactionRepository.save(tx);

        auditService.logAction(user.getId(), "CREATE_TRANSACTION", savedTx.getTransactionId().toString(),
                "Created transaction to " + tx.getBeneficiaryName() + " amount " + tx.getAmount(), "0.0.0.0");

        return savedTx;
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
        tx.setStatus(Transaction.TransactionStatus.SIGNED);
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
            if (sdithService.verifyTransaction(tx.getTransactionHash(), tx.getSdithSignature(), key.getPublicKey())) {
                return true;
            }
        }
        return false;
    }

    public List<Transaction> getUserTransactions(User user) {
        return transactionRepository.findByInitiatedBy(user);
    }

    private String buildDataString(Transaction tx) {
        return String.format("{id:%s,amount:%s,to:%s}", tx.getTransactionId(), tx.getAmount(), tx.getToAccount());
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
