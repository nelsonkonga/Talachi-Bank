package com.talachibank.signature.util;

import org.bouncycastle.crypto.digests.SHAKEDigest;

/**
 * Sampler for SDitH cryptographic operations.
 */
public class Sampler {

    /**
     * Sample a constant weight vector of length n and weight w from a seed.
     * Uses SHAKE256 for expansion and a shuffle algorithm.
     */
    public static byte[] sampleConstantWeightVector(byte[] seed, int n, int w) {
        SHAKEDigest shake = new SHAKEDigest(256);
        shake.update(seed, 0, seed.length);

        byte[] v = new byte[n];
        // 1. First w elements are non-zero random GF256
        // 2. Shuffle the vector

        // We need enough bytes for non-zero values and for the shuffle
        // To avoid bias, we use a simple rejection sampling or just enough bits.
        int nonZeroBytesNeeded = w;
        int shuffleBytesNeeded = n * 4; // overkill but safe

        byte[] randomBytes = new byte[nonZeroBytesNeeded + shuffleBytesNeeded];
        shake.doFinal(randomBytes, 0, randomBytes.length);

        int ptr = 0;
        for (int i = 0; i < w; i++) {
            byte val = randomBytes[ptr++];
            if (val == 0)
                val = 1; // Simple fix for non-zero
            v[i] = val;
        }

        // Fisher-Yates shuffle
        for (int i = n - 1; i > 0; i--) {
            int j = ((randomBytes[ptr] & 0xFF) | ((randomBytes[ptr + 1] & 0xFF) << 8)) % (i + 1);
            ptr += 2;
            if (ptr >= randomBytes.length - 2) {
                // Should not happen with enough bytes, but for safety:
                ptr = nonZeroBytesNeeded;
            }
            byte temp = v[i];
            v[i] = v[j];
            v[j] = temp;
        }

        return v;
    }
}
