package com.talachibank.signature.core;

import org.bouncycastle.math.ec.ECPoint;
import org.bouncycastle.asn1.x9.X9ECParameters;
import org.bouncycastle.crypto.ec.CustomNamedCurves;
import org.junit.jupiter.api.Test;
import java.math.BigInteger;
import java.security.SecureRandom;
import static org.junit.jupiter.api.Assertions.*;

public class SDithSignatureTest {

    @Test
    public void testSerialization() {
        X9ECParameters ecParams = CustomNamedCurves.getByName("secp256k1");
        ECPoint G = ecParams.getG();

        SecureRandom random = new SecureRandom();
        BigInteger s = new BigInteger(256, random);
        // Ensure s is within curve order for realistic test, though SDithSignature
        // itself is generic
        s = s.mod(ecParams.getN());

        SDithSignature sig = new SDithSignature(G, s);
        byte[] bytes = sig.toBytes();

        // R is compressed (33 bytes) + s (32 bytes) = 65 bytes
        assertEquals(65, bytes.length);

        SDithSignature recovered = SDithSignature.fromBytes(bytes);
        assertEquals(sig.getR(), recovered.getR());
        assertEquals(sig.getS(), recovered.getS());
    }

    @Test
    public void testSSizeHandling() {
        X9ECParameters ecParams = CustomNamedCurves.getByName("secp256k1");
        ECPoint G = ecParams.getG();

        // Test with small S (less than 32 bytes)
        BigInteger smallS = BigInteger.valueOf(12345);
        SDithSignature sigSmall = new SDithSignature(G, smallS);
        byte[] bytesSmall = sigSmall.toBytes();
        assertEquals(65, bytesSmall.length);

        SDithSignature recoveredSmall = SDithSignature.fromBytes(bytesSmall);
        assertEquals(smallS, recoveredSmall.getS());

        // Test with large S (32 bytes exactly)
        byte[] largeSBytes = new byte[32];
        for (int i = 0; i < 32; i++)
            largeSBytes[i] = (byte) 0xFF;
        BigInteger largeS = new BigInteger(1, largeSBytes);
        SDithSignature sigLarge = new SDithSignature(G, largeS);
        byte[] bytesLarge = sigLarge.toBytes();
        assertEquals(65, bytesLarge.length);

        SDithSignature recoveredLarge = SDithSignature.fromBytes(bytesLarge);
        assertEquals(largeS, recoveredLarge.getS());

        // Test with S that has a sign bit making it 33 bytes in toByteArray()
        byte[] signBitSBytes = new byte[32];
        signBitSBytes[0] = (byte) 0x80; // High bit set
        BigInteger signBitS = new BigInteger(1, signBitSBytes);
        SDithSignature sigSignBit = new SDithSignature(G, signBitS);
        byte[] bytesSignBit = sigSignBit.toBytes();
        assertEquals(65, bytesSignBit.length);

        SDithSignature recoveredSignBit = SDithSignature.fromBytes(bytesSignBit);
        assertEquals(signBitS, recoveredSignBit.getS());
    }
}
