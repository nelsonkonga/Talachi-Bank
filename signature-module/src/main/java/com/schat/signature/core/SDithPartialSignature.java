package com.schat.signature.core;

import java.math.BigInteger;

public class SDithPartialSignature {
    private final BigInteger r;
    private final BigInteger s;
    private final int shareIndex;
    private final BigInteger messageHash;

    public SDithPartialSignature(BigInteger r, BigInteger s, int shareIndex, BigInteger messageHash) {
        this.r = r;
        this.s = s;
        this.shareIndex = shareIndex;
        this.messageHash = messageHash;
    }

    // Getters..
    public BigInteger getR() { return r; }
    public BigInteger getS() { return s; }
    public int getShareIndex() { return shareIndex; }
    public BigInteger getMessageHash() { return messageHash; }
}
