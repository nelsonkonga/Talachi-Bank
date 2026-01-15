package com.talachibank.signature.config;

import java.math.BigInteger;

public class SignatureConfig {
    public static final int DEFAULT_THRESHOLD = 3;
    public static final int DEFAULT_TOTAL_PARTIES = 5;
    public static final BigInteger DEFAULT_CURVE_ORDER = new BigInteger(
        "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141", 16
    );

    private int threshold;
    private int totalParties;
    private BigInteger curveOrder;

    public SignatureConfig() {
        this(DEFAULT_THRESHOLD, DEFAULT_TOTAL_PARTIES, DEFAULT_CURVE_ORDER);
    }

    public SignatureConfig(int threshold, int totalParties, BigInteger curveOrder) {
        this.threshold = threshold;
        this.totalParties = totalParties;
        this.curveOrder = curveOrder;
    }

    // Getters and setters..
    public int getThreshold() { return threshold; }
    public void setThreshold(int threshold) { this.threshold = threshold; }

    public int getTotalParties() { return totalParties; }
    public void setTotalParties(int totalParties) { this.totalParties = totalParties; }

    public BigInteger getCurveOrder() { return curveOrder; }
    public void setCurveOrder(BigInteger curveOrder) { this.curveOrder = curveOrder; }
}
