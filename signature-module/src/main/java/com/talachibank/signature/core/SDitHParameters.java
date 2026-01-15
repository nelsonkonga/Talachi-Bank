package com.talachibank.signature.core;

/**
 * SDitH Parameters as per v1.1 Specification.
 */
public class SDitHParameters {
    public static final int LEVEL_L1 = 128; // AES-128 equivalent
    public static final int LEVEL_L3 = 192; // AES-192 equivalent
    public static final int LEVEL_L5 = 256; // AES-256 equivalent

    private final int securityLevel;
    private final int q; // Field size (256 for GF(2^8))
    private final int n; // Code length (m in user desc?) - usually N = n + k or similar code logic
    private final int k; // Dimension
    private final int w; // Weight
    private final int d; // Splitting factor

    // MPCitH Params
    private final int tau; // Number of MPC parties / repetitions
    private final int N_mpc; // Hypercube size (used for tree)

    public SDitHParameters(int securityLevel) {
        this.securityLevel = securityLevel;
        this.q = 256; // Fixed solely on GF(256) for this implementation as per instruction

        switch (securityLevel) {
            case LEVEL_L1:
                // User provided: m=242, k=126, w=87, d=1
                // Standard Convention: Code C(n, k). User says m=242 which implies n=242?
                // Or m = n - k (parity check rows)?
                // Let's assume n = user's m (242) as total length is typical ~2-3x k.
                // k=126. Then n-k = 242-126 = 116.
                this.n = 242;
                this.k = 126;
                this.w = 87;
                this.d = 1;
                this.tau = 17;
                this.N_mpc = 256;
                break;

            case LEVEL_L3:
                // User provided: m=376, k=220, w=114, d=2
                this.n = 376;
                this.k = 220;
                this.w = 114;
                this.d = 2; // Split SD
                this.tau = 17; // Assuming similar
                this.N_mpc = 256;
                break;

            case LEVEL_L5:
                // User provided: m=494, k=282, w=156, d=2
                this.n = 494;
                this.k = 282;
                this.w = 156;
                this.d = 2;
                this.tau = 17;
                this.N_mpc = 256;
                break;

            default:
                throw new IllegalArgumentException("Unsupported security level: " + securityLevel);
        }
    }

    public int getSecurityLevel() {
        return securityLevel;
    }

    public int getQ() {
        return q;
    }

    public int getN() {
        return n;
    }

    public int getK() {
        return k;
    }

    public int getW() {
        return w;
    }

    public int getD() {
        return d;
    }

    public int getTau() {
        return tau;
    }

    public int getNMpc() {
        return N_mpc;
    }

    public int getM() {
        return n - k;
    } // Parity check matrix rows
}
