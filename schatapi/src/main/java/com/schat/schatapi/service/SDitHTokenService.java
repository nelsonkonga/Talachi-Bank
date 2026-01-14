package com.schat.schatapi.service;

import com.schat.signature.core.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.Base64;

@Service
public class SDitHTokenService {
    private static final Logger logger = LoggerFactory.getLogger(SDitHTokenService.class);

    private SDitHSigner signer = new SDitHSigner();
    private SDitHCodeBasedKeyPair serverKeyPair;

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
            byte[] msg = token.getBytes();
            byte[] signature = signer.sign(msg, serverKeyPair.getPrivateKey());
            String sigB64 = Base64.getEncoder().encodeToString(signature);
            return token + "::" + sigB64;
        } catch (Exception e) {
            logger.error("Token signing failed", e);
            throw new RuntimeException("Signing failed", e);
        }
    }

    public boolean verifyTokenSignature(String signedToken) {
        try {
            String[] parts = signedToken.split("::");
            if (parts.length != 2)
                return false;

            String token = parts[0];
            byte[] sigBytes = Base64.getDecoder().decode(parts[1]);

            return signer.verify(token.getBytes(), sigBytes, serverKeyPair.getPublicKey());
        } catch (Exception e) {
            logger.error("Verification failed", e);
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
            SDitHCodeBasedKeyPair.SDitHPrivateKey sk = new SDitHCodeBasedKeyPair.SDitHPrivateKey(privateKeyBytes,
                    params);
            return signer.sign(data, sk);
        } catch (Exception e) {
            logger.error("Data signing failed", e);
            throw new RuntimeException("Signing failed", e);
        }
    }

    public boolean verify(byte[] data, byte[] signature, byte[] publicKeyBytes) {
        try {
            SDitHParameters params = new SDitHParameters(SECURITY_LEVEL);
            // [NOTE] In a real app, the syndrome should be stored as well.
            // For this demo verify logic, we use a placeholder if syndrome is not stored in
            // DB.
            SDitHCodeBasedKeyPair.SDitHPublicKey pk = new SDitHCodeBasedKeyPair.SDitHPublicKey(publicKeyBytes,
                    new byte[0], params);
            return signer.verify(data, signature, pk);
        } catch (Exception e) {
            logger.error("Verification failed", e);
            return false;
        }
    }

    public byte[] signTransaction(String transactionHash, byte[] privateKeyBytes) {
        return sign(transactionHash.getBytes(), privateKeyBytes);
    }

    public boolean verifyTransaction(String transactionHash, byte[] signature, byte[] publicKeyBytes) {
        return verify(transactionHash.getBytes(), signature, publicKeyBytes);
    }

    public SDitHCodeBasedKeyPair generateKeyPair(int securityLevel) {
        try {
            SDitHParameters params = new SDitHParameters(securityLevel);
            return signer.generateKeyPair(params);
        } catch (Exception e) {
            throw new RuntimeException("Key generation failed", e);
        }
    }

    public String extractUnsignedToken(String signedToken) {
        String[] parts = signedToken.split("::");
        return parts.length == 2 ? parts[0] : signedToken;
    }
}
