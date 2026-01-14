package com.schat.schatapi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID transactionId;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    private String fromAccount;
    private String toAccount;
    private String beneficiaryName;

    private BigDecimal amount;
    private String currency; // EUR, USD

    @Column(length = 500)
    private String description;

    @ManyToOne
    @JoinColumn(name = "initiated_by_id")
    private User initiatedBy;

    @CreationTimestamp
    private LocalDateTime initiatedAt;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status; // PENDING, SIGNED, APPROVED, EXECUTED, REJECTED

    private Integer riskScore;

    // Signature Data
    private Integer signatureLevel; // 1, 3, 5

    @Column(columnDefinition = "TEXT")
    private String transactionHash; // SHA3-256 of fields

    @Lob
    private byte[] sdithSignature;

    private Boolean signatureVerified;

    // Multi-signature
    @ElementCollection
    private List<Long> approverIds; // User IDs required

    @ElementCollection
    @CollectionTable(name = "transaction_approvals", joinColumns = @JoinColumn(name = "transaction_id"))
    @MapKeyColumn(name = "approver_id")
    @Column(name = "signature_blob")
    private Map<Long, byte[]> approvalSignatures;

    private LocalDateTime executedAt;

    // Compliance
    @ElementCollection
    private List<String> complianceFlags; // AML_CHECKED, SANCTIONS_CLEAR

    public enum TransactionType {
        WIRE_TRANSFER, SWIFT, INTERNAL_TRANSFER, LOAN_DISBURSEMENT
    }

    public enum TransactionStatus {
        PENDING, SIGNED, APPROVED, EXECUTED, REJECTED, FAILED
    }
}
