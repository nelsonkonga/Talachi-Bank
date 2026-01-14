package com.schat.signature.core;

/**
 * Key Pair for Code-Based SDitH Scheme.
 */
public class SDitHCodeBasedKeyPair {
    private final SDitHPublicKey publicKey;
    private final SDitHPrivateKey privateKey;

    public SDitHCodeBasedKeyPair(SDitHPublicKey publicKey, SDitHPrivateKey privateKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    public SDitHPublicKey getPublicKey() {
        return publicKey;
    }

    public SDitHPrivateKey getPrivateKey() {
        return privateKey;
    }

    public static class SDitHPublicKey {
        private final byte[] publicKey; // Matrix H (flattened)
        private final byte[] syndrome; // Syndrome s
        private final SDitHParameters params;

        public SDitHPublicKey(byte[] publicKey, byte[] syndrome, SDitHParameters params) {
            this.publicKey = publicKey;
            this.syndrome = syndrome;
            this.params = params;
        }

        public byte[] getPublicKey() {
            return publicKey;
        }

        public byte[] getSyndrome() {
            return syndrome;
        }

        public SDitHParameters getParams() {
            return params;
        }
    }

    public static class SDitHPrivateKey {
        private final byte[] secretKey; // Error vector e
        private final SDitHParameters params;

        public SDitHPrivateKey(byte[] secretKey, SDitHParameters params) {
            this.secretKey = secretKey;
            this.params = params;
        }

        public byte[] getSecretKey() {
            return secretKey;
        }

        public SDitHParameters getParams() {
            return params;
        }
    }
}
