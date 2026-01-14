package com.schat.schatapi.seeder;

import com.schat.schatapi.model.Transaction;
import com.schat.schatapi.model.User;
import com.schat.schatapi.model.UserKeyPair;
import com.schat.schatapi.repository.TransactionRepository;
import com.schat.schatapi.repository.UserKeyPairRepository;
import com.schat.schatapi.repository.UserRepository;
import com.schat.schatapi.service.SDitHTokenService;
import com.schat.signature.core.SDitHCodeBasedKeyPair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserKeyPairRepository userKeyPairRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private SDitHTokenService sdithService;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Wait for standard initializer? Or just proceed.
            // Assuming DatabaseInitializer runs first or we just add to it.
        }

        seedBankingData();
    }

    private void seedBankingData() {
        User user = userRepository.findByUsername("user").orElse(null);
        if (user == null)
            return;

        if (userKeyPairRepository.findByUser(user).isEmpty()) {
            System.out.println("Seeding User Key Pair...");
            SDitHCodeBasedKeyPair kp = sdithService.generateKeyPair(192); // Level 3

            UserKeyPair ukp = UserKeyPair.builder()
                    .user(user)
                    .publicKey(kp.getPublicKey().getPublicKey())
                    .privateKeyEncrypted(kp.getPrivateKey().getSecretKey()) // Storing raw for demo
                    .securityLevel(192)
                    .status(UserKeyPair.KeyStatus.ACTIVE)
                    .createdAt(LocalDateTime.now())
                    .usageCount(0)
                    .build();

            if (ukp != null) {
                userKeyPairRepository.save(ukp);
            }
        }

        if (transactionRepository.count() == 0) {
            System.out.println("Seeding Transactions...");

            // 1. Signed Transaction
            Transaction t1 = Transaction.builder()
                    .transactionId(java.util.UUID.randomUUID())
                    .transactionType(Transaction.TransactionType.WIRE_TRANSFER)
                    .fromAccount("EUR-123456789")
                    .toAccount("BE71 1234 5678 9012")
                    .beneficiaryName("Tech Corp SA")
                    .amount(new BigDecimal("12500.00"))
                    .currency("EUR")
                    .description("IT Services Q4")
                    .initiatedBy(user)
                    .initiatedAt(LocalDateTime.now().minusDays(2))
                    .status(Transaction.TransactionStatus.SIGNED)
                    .riskScore(25)
                    .signatureLevel(192)
                    .signatureVerified(true)
                    .transactionHash("1a2b3c4d...")
                    .sdithSignature(new byte[64]) // Mock sig
                    .build();
            if (t1 != null) {
                transactionRepository.save(t1);
            }

            // 2. Pending Transaction
            Transaction t2 = Transaction.builder()
                    .transactionId(java.util.UUID.randomUUID())
                    .transactionType(Transaction.TransactionType.SWIFT)
                    .fromAccount("EUR-123456789")
                    .toAccount("US99 9876 5432 1098")
                    .beneficiaryName("Global Supplies Inc")
                    .amount(new BigDecimal("150000.00")) // High amount
                    .currency("USD")
                    .description("Equipment Purchase")
                    .initiatedBy(user)
                    .initiatedAt(LocalDateTime.now().minusHours(4))
                    .status(Transaction.TransactionStatus.PENDING)
                    .riskScore(85) // High risk
                    .build();
            if (t2 != null) {
                transactionRepository.save(t2);
            }
        }
    }
}
