package com.talachibank.signature.core;

import java.math.BigInteger;
import org.bouncycastle.math.ec.ECPoint;
import org.bouncycastle.asn1.x9.X9ECParameters;
import org.bouncycastle.crypto.ec.CustomNamedCurves;
import org.bouncycastle.asn1.sec.SECNamedCurves;

public class SDithSignature {
    private final ECPoint r;
    private final BigInteger s;

    public SDithSignature(ECPoint r, BigInteger s) {
        this.r = r;
        this.s = s;
    }

    public ECPoint getR() {
        return r;
    }

    public BigInteger getS() {
        return s;
    }

    public byte[] toBytes() {
        // Encode R as compressed point (33 bytes for secp256k1)
        byte[] rBytes = r.getEncoded(true);
        // Encode s as fixed 32-byte big-endian
        byte[] sBytes = bigIntegerTo32Bytes(s);

        byte[] result = new byte[rBytes.length + sBytes.length];
        System.arraycopy(rBytes, 0, result, 0, rBytes.length);
        System.arraycopy(sBytes, 0, result, rBytes.length, sBytes.length);
        return result;
    }

    public static SDithSignature fromBytes(byte[] data) {
        // Assume secp256k1 for decoding constraint
        // R is 33 bytes (compressed)
        int rLen = 33;
        if (data.length < rLen) {
            throw new IllegalArgumentException("Signature too short");
        }

        X9ECParameters ecParams = CustomNamedCurves.getByName("secp256k1");
        if (ecParams == null) {
            ecParams = SECNamedCurves.getByName("secp256k1");
        }

        byte[] rBytes = new byte[rLen];
        System.arraycopy(data, 0, rBytes, 0, rLen);
        ECPoint r = ecParams.getCurve().decodePoint(rBytes);

        byte[] sBytes = new byte[data.length - rLen];
        System.arraycopy(data, rLen, sBytes, 0, sBytes.length);
        BigInteger s = new BigInteger(1, sBytes);

        return new SDithSignature(r, s);
    }

    private byte[] bigIntegerTo32Bytes(BigInteger n) {
        byte[] array = n.toByteArray();
        if (array.length == 32)
            return array;
        byte[] result = new byte[32];
        int len = Math.min(array.length, 32);
        // Copy right aligned
        int srcPos = array.length > 32 ? array.length - 32 : 0;
        int destPos = 32 - len;
        // If negative/sign bit issues, this handles unsigned view effectively for
        // cryptographic scalars
        // But BigInteger.toByteArray() assumes signed. 256-bit scalar shouldn't be
        // negative.
        System.arraycopy(array, srcPos, result, destPos, len);
        return result;
    }
}
