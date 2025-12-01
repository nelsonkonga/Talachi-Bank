package com.schat.signature.core;

import java.math.BigInteger;
import java.security.spec.ECPoint;

public class SDithKeyPair {
    private final SDithPublicKey publicKey;
    private final SDithPrivateKeyShare privateKeyShare;
    
    public SDithKeyPair(SDithPublicKey publicKey, SDithPrivateKeyShare privateKeyShare) {
        this.publicKey = publicKey;
        this.privateKeyShare = privateKeyShare;
    }
    
    public SDithPublicKey getPublicKey() { return publicKey; }
    public SDithPrivateKeyShare getPrivateKeyShare() { return privateKeyShare; }
}
