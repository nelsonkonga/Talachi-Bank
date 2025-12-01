package com.schat.signature.core;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.*;

public class SDithThresholdScheme {
    private static final SecureRandom random = new SecureRandom();

    /**
     * To Generate a (t,n) threshold key pair for SDith scheme..
     */
    public static SDithKeyGenerator generateKeyPair(int threshold, int totalParties, 
                                                   BigInteger curveOrder) {
        // Generating master private key..
        BigInteger masterPrivateKey = new BigInteger(256, random).mod(curveOrder);

        // Generating polynomial coefficients..
        List<BigInteger> coefficients = new ArrayList<>();
        coefficients.add(masterPrivateKey); // a0 is the master key..

        for (int i = 1; i < threshold; i++) {
            coefficients.add(new BigInteger(256, random).mod(curveOrder));
        }

        // Generating shares for each party..
        Map<Integer, BigInteger> shares = new HashMap<>();
        for (int i = 1; i <= totalParties; i++) {
            BigInteger share = evaluatePolynomial(coefficients, BigInteger.valueOf(i), curveOrder);
            shares.put(i, share);
        }

        // Calculating public key (g^masterPrivateKey)..
        // In practice, this would use elliptic curve multiplication..
        BigInteger publicKeyValue = BigInteger.valueOf(2).modPow(masterPrivateKey, curveOrder);

        SDithPublicKey publicKey = new SDithPublicKey(
            null, // ECPoint would be set in actual EC implementation..
            threshold, 
            totalParties, 
            curveOrder
        );

        return new SDithKeyGenerator(publicKey, shares, coefficients);
    }

    /**
     * To Generate partial signature using SDith scheme..
     * NOTE: This method creates random nonces, use generatePartialSignatureWithSharedNonce for coordinated signing
     */
    public static SDithPartialSignature generatePartialSignature(
            byte[] message, 
            BigInteger privateShare, 
            int shareIndex,
            BigInteger curveOrder) {

        // Hashing the message..
        BigInteger messageHash = hashMessage(message, curveOrder);

        // Generating random nonce..
        BigInteger k = new BigInteger(256, random).mod(curveOrder);
        BigInteger kInverse = k.modInverse(curveOrder);

        // Calculating r = g^k mod p (in EC this would be x-coordinate of k*G)
        BigInteger r = BigInteger.valueOf(2).modPow(k, curveOrder).mod(curveOrder);

        // Calculating partial signature s_i = share_i * H(m) + k mod q ..
        BigInteger s = privateShare.multiply(messageHash)
                                 .add(k)
                                 .mod(curveOrder);

        return new SDithPartialSignature(r, s, shareIndex, messageHash);
    }

    /**
     * Generate partial signature with a pre-determined shared nonce
     * This ensures all parties use the same r value
     * 
     * @param message The message to sign
     * @param privateShare The party's private key share
     * @param shareIndex The party's index (1 to n)
     * @param sharedNonce The coordinated nonce (same for all parties)
     * @param curveOrder The order of the curve
     * @return Partial signature with consistent r value
     */
    public static SDithPartialSignature generatePartialSignatureWithSharedNonce(
            byte[] message, 
            BigInteger privateShare, 
            int shareIndex,
            BigInteger sharedNonce,
            BigInteger curveOrder) {

        // Hashing the message
        BigInteger messageHash = hashMessage(message, curveOrder);

        // Use the shared nonce (all parties must use the same value)
        BigInteger k = sharedNonce.mod(curveOrder);
        if (k.equals(BigInteger.ZERO)) {
            k = BigInteger.ONE;
        }

        // Calculating r = g^k mod p (same for all parties)
        BigInteger r = BigInteger.valueOf(2).modPow(k, curveOrder).mod(curveOrder);

        // Calculating partial signature s_i = share_i * H(m) + k mod q
        BigInteger s = privateShare.multiply(messageHash)
                                 .add(k)
                                 .mod(curveOrder);

        return new SDithPartialSignature(r, s, shareIndex, messageHash);
    }

    /**
     * Generate a deterministic shared nonce from message
     * All parties can independently compute this to get the same nonce
     * 
     * @param message The message being signed
     * @param curveOrder The order of the curve
     * @return A deterministic nonce derived from the message
     */
    public static BigInteger generateDeterministicNonce(byte[] message, BigInteger curveOrder) {
        try {
            // Use SHA-256 to hash the message
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(message);
            
            // Convert to BigInteger and reduce mod curve order
            BigInteger nonce = new BigInteger(1, hash).mod(curveOrder);
            
            // Ensure nonce is not zero
            if (nonce.equals(BigInteger.ZERO)) {
                nonce = BigInteger.ONE;
            }
            
            return nonce;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate deterministic nonce", e);
        }
    }

    /**
     * To Combine partial signatures to create final signature..
     */
    public static SDithSignature combineSignatures(
            List<SDithPartialSignature> partialSignatures,
            SDithPublicKey publicKey,
            byte[] message) {

        if (partialSignatures.size() < publicKey.getThreshold()) {
            throw new IllegalArgumentException(
                "Insufficient partial signatures. Required: " + 
                publicKey.getThreshold() + ", Provided: " + partialSignatures.size());
        }

        // Verifying all partial signatures use the same r value..
        BigInteger r = partialSignatures.get(0).getR();
        for (SDithPartialSignature partial : partialSignatures) {
            if (!partial.getR().equals(r)) {
                throw new IllegalArgumentException("Inconsistent r values in partial signatures");
            }
        }

        // Using Lagrange interpolation to combine shares..
        BigInteger combinedS = BigInteger.ZERO;
        BigInteger curveOrder = publicKey.getCurveOrder();

        for (SDithPartialSignature partial : partialSignatures) {
            BigInteger lagrangeCoeff = computeLagrangeCoefficient(
                partial.getShareIndex(),
                partialSignatures.stream()
                    .map(SDithPartialSignature::getShareIndex)
                    .collect(java.util.stream.Collectors.toList()),
                curveOrder
            );

            combinedS = combinedS.add(partial.getS().multiply(lagrangeCoeff))
                               .mod(curveOrder);
        }

        return new SDithSignature(r, combinedS);
    }

    /**
     * To Verify a signature ..
     */
    public static boolean verifySignature(byte[] message, SDithSignature signature, 
                                        SDithPublicKey publicKey) {
        BigInteger messageHash = hashMessage(message, publicKey.getCurveOrder());

        // In EC: R = s*G - H(m)*Y ..
        // For demonstration using modular exponentiation:..
        BigInteger left = BigInteger.valueOf(2).modPow(signature.getS(), publicKey.getCurveOrder());
        BigInteger right = signature.getR()
            .multiply(
                BigInteger.valueOf(2).modPow(
                    messageHash.multiply(extractPublicValue(publicKey))
                              .mod(publicKey.getCurveOrder()),
                    publicKey.getCurveOrder()
                )
            ).mod(publicKey.getCurveOrder());

        return left.equals(right);
    }

    // Helper methods..
    private static BigInteger evaluatePolynomial(List<BigInteger> coefficients, 
                                               BigInteger x, BigInteger modulus) {
        BigInteger result = BigInteger.ZERO;
        for (int i = 0; i < coefficients.size(); i++) {
            result = result.add(coefficients.get(i).multiply(x.pow(i))).mod(modulus);
        }
        return result;
    }

    private static BigInteger computeLagrangeCoefficient(int index, List<Integer> indices, 
                                                        BigInteger modulus) {
        BigInteger numerator = BigInteger.ONE;
        BigInteger denominator = BigInteger.ONE;

        BigInteger iBig = BigInteger.valueOf(index);

        for (int j : indices) {
            if (j != index) {
                BigInteger jBig = BigInteger.valueOf(j);
                numerator = numerator.multiply(jBig.negate()).mod(modulus);
                denominator = denominator.multiply(iBig.subtract(jBig)).mod(modulus);
            }
        }

        return numerator.multiply(denominator.modInverse(modulus)).mod(modulus);
    }

    private static BigInteger hashMessage(byte[] message, BigInteger modulus) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(message);
            return new BigInteger(1, hash).mod(modulus);
        } catch (Exception e) {
            throw new RuntimeException("Hashing failed", e);
        }
    }

    private static BigInteger extractPublicValue(SDithPublicKey publicKey) {
        // In real implementation, extraction will be made from ECPoint..
        return BigInteger.valueOf(123456789); // Placeholder..
    }
}
