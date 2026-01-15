package com.talachibank.signature.core;

/**
 * GF(256) Arithmetic Implementation.
 * Uses the AES polynomial: P(x) = x^8 + x^4 + x^3 + x + 1 (0x11B).
 * Optimized with lookup tables (Log/Exp) for multiplication.
 */
public class GF256 {
    // Rijndael finite field
    public static final int FIELD_SIZE = 256;
    private static final int PRIMITIVE_POLY = 0x11B;

    // Log/Exp tables for fast multiplication
    private static final int[] EXP = new int[512];
    private static final int[] LOG = new int[256];

    static {
        // Initialize tables
        int x = 1;
        for (int i = 0; i < 255; i++) {
            EXP[i] = x;
            LOG[x] = i;
            x <<= 1; // Multiply by x
            if ((x & 0x100) != 0) { // Check for carry
                x ^= PRIMITIVE_POLY; // Modulo P(x)
            }
        }
        // Extended table for easy lookup without modulo 255 every time
        for (int i = 255; i < 512; i++) {
            EXP[i] = EXP[i - 255];
        }
        // Log[0] is undefined, handled in mul
    }

    /**
     * Addition in GF(2^8) is XOR.
     */
    public static byte add(byte a, byte b) {
        return (byte) (a ^ b);
    }

    public static byte sub(byte a, byte b) {
        return (byte) (a ^ b);
    }

    /**
     * Multiplication in GF(2^8) using log tables.
     */
    public static byte mul(byte a, byte b) {
        if (a == 0 || b == 0)
            return 0;
        int ia = a & 0xFF;
        int ib = b & 0xFF;
        return (byte) EXP[LOG[ia] + LOG[ib]];
    }

    /**
     * Inversion in GF(2^8).
     */
    public static byte inv(byte a) {
        if (a == 0)
            throw new ArithmeticException("Division by zero in GF(256)");
        int ia = a & 0xFF;
        return (byte) EXP[255 - LOG[ia]];
    }

    public static byte div(byte a, byte b) {
        if (b == 0)
            throw new ArithmeticException("Division by zero in GF(256)");
        if (a == 0)
            return 0;
        int ia = a & 0xFF;
        int ib = b & 0xFF;
        // log(a/b) = log(a) - log(b) mod 255
        // = log(a) + 255 - log(b)
        return (byte) EXP[LOG[ia] + 255 - LOG[ib]];
    }

    // --- Vector/Matrix Operations ---

    /**
     * Scalar multiplication of a vector
     */
    public static byte[] mulScalar(byte[] v, byte scalar) {
        byte[] res = new byte[v.length];
        for (int i = 0; i < v.length; i++) {
            res[i] = mul(v[i], scalar);
        }
        return res;
    }

    /**
     * Add scalar to all elements
     */
    public static byte[] addScalar(byte[] v, byte scalar) {
        byte[] res = new byte[v.length];
        for (int i = 0; i < v.length; i++) {
            res[i] = add(v[i], scalar);
        }
        return res;
    }

    /**
     * Vector dot product
     */
    public static byte dotProduct(byte[] u, byte[] v) {
        if (u.length != v.length)
            throw new IllegalArgumentException("Vector length mismatch");
        byte res = 0;
        for (int i = 0; i < u.length; i++) {
            res = add(res, mul(u[i], v[i]));
        }
        return res;
    }

    /**
     * Matrix-Vector Multiplication: y = H * x
     * H is flat array (rows * cols), row-major.
     */
    public static byte[] matrixVecMul(byte[] H, byte[] x, int rows, int cols) {
        if (x.length != cols)
            throw new IllegalArgumentException("Dimension mismatch");
        byte[] y = new byte[rows];

        for (int r = 0; r < rows; r++) {
            byte sum = 0;
            for (int c = 0; c < cols; c++) {
                byte hVal = H[r * cols + c];
                byte xVal = x[c];
                sum = add(sum, mul(hVal, xVal));
            }
            y[r] = sum;
        }
        return y;
    }
}
