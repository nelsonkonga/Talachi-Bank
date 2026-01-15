package com.talachibank.signature.core;

/**
 * Key Pair for SDitH Scheme.
 */
public class SDithKeyPair {
    private final SDithPublicKey publicKey;
    private final SDithPrivateKey privateKey;

    public SDithKeyPair(SDithPublicKey publicKey, SDithPrivateKey privateKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    public SDithPublicKey getPublicKey() {
        return publicKey;
    }

    public SDithPrivateKey getPrivateKey() {
        return privateKey;
    }
}
