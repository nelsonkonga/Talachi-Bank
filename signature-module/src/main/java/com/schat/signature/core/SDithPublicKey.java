package com.schat.signature.core;

import java.math.BigInteger;
import java.security.spec.ECPoint;

public class SDithPublicKey {
    private final ECPoint publicPoint;
    private final int threshold;
    private final int totalParties;
    private final BigInteger curveOrder;

    public SDithPublicKey(ECPoint publicPoint, int threshold, int totalParties, BigInteger curveOrder) {
        this.publicPoint = publicPoint;
        this.threshold = threshold;
        this.totalParties = totalParties;
        this.curveOrder = curveOrder;
    }

    // Getters..
    public ECPoint getPublicPoint() { return publicPoint; }
    public int getThreshold() { return threshold; }
    public int getTotalParties() { return totalParties; }
    public BigInteger getCurveOrder() { return curveOrder; }
}
