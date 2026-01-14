package com.schat.signature.core;

import java.math.BigInteger;
import org.bouncycastle.math.ec.ECPoint;

public class SDithPartialSignature {
    private final ECPoint r; // R_i = k_i * G
    private final BigInteger s; // s_i
    private final int shareIndex;
    private final BigInteger messageHash; // Can be debugging info

    public SDithPartialSignature(ECPoint r, BigInteger s, int shareIndex, BigInteger messageHash) {
        this.r = r;
        this.s = s;
        this.shareIndex = shareIndex;
        this.messageHash = messageHash;
    }

    // Getters
    public ECPoint getR() {
        return r;
    }

    public BigInteger getS() {
        return s;
    }

    public int getShareIndex() {
        return shareIndex;
    }

    public BigInteger getMessageHash() {
        return messageHash;
    }
}
