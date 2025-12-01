package com.schat.signature.core;

import java.math.BigInteger;
import java.util.Arrays;

public class SDithSignature {
    private final BigInteger r;
    private final BigInteger s;

    public SDithSignature(BigInteger r, BigInteger s) {
        this.r = r;
        this.s = s;
    }

    public BigInteger getR() { return r; }
    public BigInteger getS() { return s; }

    public byte[] toBytes() {
        byte[] rBytes = r.toByteArray();
        byte[] sBytes = s.toByteArray();
        byte[] result = new byte[rBytes.length + sBytes.length];
        System.arraycopy(rBytes, 0, result, 0, rBytes.length);
        System.arraycopy(sBytes, 0, result, rBytes.length, sBytes.length);
        return result;
    }

    public static SDithSignature fromBytes(byte[] data) {
        int half = data.length / 2;
        BigInteger r = new BigInteger(Arrays.copyOfRange(data, 0, half));
        BigInteger s = new BigInteger(Arrays.copyOfRange(data, half, data.length));
        return new SDithSignature(r, s);
    }
}

