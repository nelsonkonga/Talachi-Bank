package com.schat.signature.core;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SDitHSignerTest {

    @Test
    public void testSDitHFlow() {
        SDitHSigner signer = new SDitHSigner();
        SDitHParameters params = new SDitHParameters(128);

        // 1. KeyGen
        SDitHCodeBasedKeyPair keyPair = signer.generateKeyPair(params);
        assertNotNull(keyPair.getPublicKey());
        assertNotNull(keyPair.getPrivateKey());
        assertEquals(128, keyPair.getPublicKey().getParams().getSecurityLevel());

        // 2. Sign
        String message = "Hello SDitH World";
        byte[] signature = signer.sign(message.getBytes(), keyPair.getPrivateKey());
        assertNotNull(signature);
        assertTrue(signature.length > 0);

        // 3. Verify
        boolean valid = signer.verify(message.getBytes(), signature, keyPair.getPublicKey());
        assertTrue(valid, "Signature should be valid");

        // 4. Verify Invalid
        boolean invalid = signer.verify("Tampered".getBytes(), signature, keyPair.getPublicKey());
        assertFalse(invalid, "Signature should be invalid for different message");
    }
}
