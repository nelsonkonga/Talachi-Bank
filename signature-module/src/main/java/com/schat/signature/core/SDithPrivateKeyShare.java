package com.schat.signature.core;

import java.math.BigInteger;

public class SDithPrivateKeyShare {
    private final BigInteger share;
    private final int index;
    private final BigInteger modulus;

    public SDithPrivateKeyShare(BigInteger share, int index, BigInteger modulus) {
        this.share = share;
        this.index = index;
        this.modulus = modulus;
    }

    // Getters..
    public BigInteger getShare() { return share; }
    public int getIndex() { return index; }
    public BigInteger getModulus() { return modulus; }
}
