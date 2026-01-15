package com.talachibank.api.service;

import com.talachibank.signature.core.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.Base64;

@Service
public class SDitHTokenService {
    private static final Logger logger = LoggerFactory.getLogger(SDitHTokenService.class);

    private SDitHSigner signer = new SDitHSigner();
    private SDithKeyPair serverKeyPair;

    // Use L1 for standard operations (fastest)
    private static final int SECURITY_LEVEL = SDitHParameters.LEVEL_L1;

    @PostConstruct
    public void init() {
        try {
            logger.info("Initializing SDitH Token Service (Code-Based GF256)...");
            SDitHParameters params = new SDitHParameters(SECURITY_LEVEL);
            this.serverKeyPair = signer.generateKeyPair(params);
            logger.info("✓ Server Key Pair Generated.");
        } catch (Exception e) {
            logger.error("Failed to initialize SDitH service", e);
            throw new RuntimeException("SDitH init failed", e);
        }
    }

    public String signToken(String token) {
        try {
            byte[] msg = token.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            byte[] signature = signer.sign(msg, serverKeyPair.getPrivateKey());
            String sigB64 = Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
            return token + "." + sigB64;
        } catch (Exception e) {
            logger.error("Token signing failed", e);
            throw new RuntimeException("Signing failed", e);
        }
    }

    public boolean verifyTokenSignature(String signedToken) {
        try {
            int lastDot = signedToken.lastIndexOf(".");
            if (lastDot == -1) {
                logger.warn("Token verification failed: No delimiter found");
                return false;
            }

            String token = signedToken.substring(0, lastDot);
            String sigB64 = signedToken.substring(lastDot + 1);

            byte[] sigBytes = Base64.getUrlDecoder().decode(sigB64);

            boolean isValid = signer.verify(token.getBytes(java.nio.charset.StandardCharsets.UTF_8), sigBytes,
                    serverKeyPair.getPublicKey());
            return isValid;
        } catch (Exception e) {
            logger.error("Verification failed with exception: {}", e.getMessage());
            return false;
        }
    }

    @org.springframework.scheduling.annotation.Scheduled(cron = "${talachibank.security.key-rotation:0 0 0 * * SUN}")
    public void rotateKeys() {
        try {
            logger.info("Rotating SDitH Server Keys...");
            SDitHParameters params = new SDitHParameters(SECURITY_LEVEL);
            this.serverKeyPair = signer.generateKeyPair(params);
            logger.info("✓ Server Keys Rotated.");
        } catch (Exception e) {
            logger.error("Key rotation failed", e);
        }
    }

    public byte[] sign(byte[] data, byte[] privateKeyBytes) {
        try {
            SDitHParameters params = new SDitHParameters(SECURITY_LEVEL);
            SDithPrivateKey sk = new SDithPrivateKey(privateKeyBytes,
                    params);
            return signer.sign(data, sk);
        } catch (Exception e) {
            logger.error("Data signing failed", e);
            throw new RuntimeException("Signing failed", e);
        }
    }

    public boolean verify(byte[] data, byte[] signature, byte[] publicKeyBytes, byte[] syndromeBytes) {
        try {
            SDitHParameters params = new SDitHParameters(SECURITY_LEVEL);
            SDithPublicKey pk = new SDithPublicKey(publicKeyBytes,
                    syndromeBytes, params);
            return signer.verify(data, signature, pk);
        } catch (Exception e) {
            logger.error("Verification failed", e);
            return false;
        }
    }

    public byte[] signTransaction(String transactionHash, byte[] privateKeyBytes) {
        return sign(transactionHash.getBytes(), privateKeyBytes);
    }

    public boolean verifyTransaction(String transactionHash, byte[] signature, byte[] publicKeyBytes,
            byte[] syndromeBytes) {
        return verify(transactionHash.getBytes(), signature, publicKeyBytes, syndromeBytes);
    }

    public SDithKeyPair generateKeyPair(int securityLevel) {
        try {
            SDitHParameters params = new SDitHParameters(securityLevel);
            return signer.generateKeyPair(params);
        } catch (Exception e) {
            throw new RuntimeException("Key generation failed", e);
        }
    }

    public String extractUnsignedToken(String signedToken) {
        String[] parts = signedToken.split("\\.");
        if (parts.length >= 3) {
            return parts[0] + "." + parts[1] + "." + parts[2];
        }
        return signedToken;
    }
}
