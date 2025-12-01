package com.schat.signature.core;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;

public class SDithKeyGenerator {
    private final SDithPublicKey publicKey;
    private final Map<Integer, BigInteger> shares;
    private final List<BigInteger> coefficients;

    public SDithKeyGenerator(SDithPublicKey publicKey, Map<Integer, BigInteger> shares, 
                           List<BigInteger> coefficients) {
        this.publicKey = publicKey;
        this.shares = shares;
        this.coefficients = coefficients;
    }

    public SDithKeyPair getKeyPairForParty(int partyIndex) {
        if (!shares.containsKey(partyIndex)) {
            throw new IllegalArgumentException("Invalid party index: " + partyIndex);
        }
        SDithPrivateKeyShare privateShare = new SDithPrivateKeyShare(
            shares.get(partyIndex), partyIndex, publicKey.getCurveOrder()
        );
        return new SDithKeyPair(publicKey, privateShare);
    }

    public SDithPublicKey getPublicKey() {
        return publicKey;
    }

    public Map<Integer, BigInteger> getShares() {
        return shares;
    }

    public List<BigInteger> getCoefficients() {
        return coefficients;
    }
}
