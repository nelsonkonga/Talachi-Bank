package com.schat.signature.core;

import java.util.Random;

/**
 * Utility class for GF(2) matrix operations.
 * Optimized for bit-packed operations where possible.
 */
public class SDithMatrixUtils {

    /**
     * Compute Syndrome s = H * e
     * H is (n-k) x n matrix
     * e is n-length vector
     * Result is (n-k)-length vector
     * 
     * @param h Parity check matrix H (flattened byte array)
     * @param e Error vector e (byte array where each bit is an element)
     * @param n Code length
     * @param k Code dimension
     * @return Syndrome vector s
     */
    public static byte[] computeSyndrome(byte[] h, byte[] e, int n, int k) {
        int rows = n - k;
        int cols = n;
        int syndromeLenBytes = (rows + 7) / 8;
        byte[] syndrome = new byte[syndromeLenBytes];

        for (int i = 0; i < rows; i++) {
            int dotProduct = 0;
            for (int j = 0; j < cols; j++) {
                // Get bit at H[i][j]
                int hBit = getBit(h, i * cols + j);
                // Get bit at e[j]
                int eBit = getBit(e, j);

                dotProduct ^= (hBit & eBit);
            }
            if (dotProduct != 0) {
                setBit(syndrome, i);
            }
        }
        return syndrome;
    }

    /**
     * Get bit at specific index from byte array
     */
    public static int getBit(byte[] data, int bitIndex) {
        int byteIndex = bitIndex / 8;
        int bitOffset = bitIndex % 8;
        if (byteIndex >= data.length)
            return 0;
        return (data[byteIndex] >> bitOffset) & 1;
    }

    /**
     * Set bit at specific index in byte array
     */
    public static void setBit(byte[] data, int bitIndex) {
        int byteIndex = bitIndex / 8;
        int bitOffset = bitIndex % 8;
        if (byteIndex < data.length) {
            data[byteIndex] |= (1 << bitOffset);
        }
    }

    /**
     * Generate a random error vector with weight w
     */
    public static byte[] generateErrorVector(int n, int w, Random random) {
        byte[] e = new byte[(n + 7) / 8];
        int[] positions = new int[w];
        int count = 0;

        while (count < w) {
            int pos = random.nextInt(n);
            boolean exists = false;
            for (int i = 0; i < count; i++) {
                if (positions[i] == pos) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                positions[count++] = pos;
                setBit(e, pos);
            }
        }
        return e;
    }
}
