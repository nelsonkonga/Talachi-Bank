package com.schat.schatapi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_key_pairs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserKeyPair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Lob
    private byte[] publicKey;

    @Lob
    private byte[] privateKeyEncrypted;

    private Integer securityLevel; // 128, 192, 256

    @Enumerated(EnumType.STRING)
    private KeyStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime lastUsedAt;

    @Builder.Default
    private Integer usageCount = 0;

    public enum KeyStatus {
        ACTIVE, REVOKED, EXPIRED
    }
}
