package com.schat.signature.service;

import com.schat.signature.core.*;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

public class TokenSigningService {
    private final SDithKeyPair keyPair;
    private final List<SDithPartialSignature> collectedPartials;

    public TokenSigningService(SDithKeyPair keyPair) {
        this.keyPair = keyPair;
        this.collectedPartials = new ArrayList<>();
    }

    /**
     * To Sign a token using threshold signature scheme..
     */
    public byte[] signToken(byte[] tokenData, List<SDithPartialSignature> partialSignatures) {
        if (partialSignatures.size() < keyPair.getPublicKey().getThreshold()) {
            throw new IllegalArgumentException(
                "Insufficient partial signatures. Required: " + 
                keyPair.getPublicKey().getThreshold());
        }

        SDithSignature finalSignature = SDithThresholdScheme.combineSignatures(
            partialSignatures, keyPair.getPublicKey(), tokenData
        );

        return finalSignature.toBytes();
    }

    /**
     * To Generate a partial signature for a token..
     */
    public SDithPartialSignature generatePartialSignature(byte[] tokenData) {
        return SDithThresholdScheme.generatePartialSignature(
            tokenData,
            keyPair.getPrivateKeyShare().getShare(),
            keyPair.getPrivateKeyShare().getIndex(),
            keyPair.getPublicKey().getCurveOrder()
        );
    }

    /**
     * To Verify a token signature..
     */
    public boolean verifyTokenSignature(byte[] tokenData, byte[] signatureBytes) {
        SDithSignature signature = SDithSignature.fromBytes(signatureBytes);
        return SDithThresholdScheme.verifySignature(tokenData, signature, keyPair.getPublicKey());
    }

    public void addPartialSignature(SDithPartialSignature partialSignature) {
        collectedPartials.add(partialSignature);
    }

    public boolean hasSufficientSignatures() {
        return collectedPartials.size() >= keyPair.getPublicKey().getThreshold();
    }

    public List<SDithPartialSignature> getCollectedPartials() {
        return new ArrayList<>(collectedPartials);
    }

    public void clearCollectedPartials() {
        collectedPartials.clear();
    }
}
