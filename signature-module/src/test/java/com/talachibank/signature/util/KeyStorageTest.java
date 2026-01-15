package com.talachibank.signature.util;

import com.talachibank.signature.core.SDithKeyPair;
import com.talachibank.signature.core.SDithPublicKey;
import com.talachibank.signature.core.SDithPrivateKey;
import com.talachibank.signature.core.SDitHParameters;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.File;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

public class KeyStorageTest {

    @TempDir
    Path tempDir;

    @Test
    public void testSaveAndLoadKeyPair() throws Exception {
        SDitHParameters params = new SDitHParameters(SDitHParameters.LEVEL_L1);

        byte[] seedH = new byte[32];
        byte[] syndrome = new byte[params.getM()];
        byte[] e = new byte[params.getN()];

        SDithPublicKey pk = new SDithPublicKey(seedH, syndrome, params);
        SDithPrivateKey sk = new SDithPrivateKey(e, params);
        SDithKeyPair keyPair = new SDithKeyPair(pk, sk);

        File file = tempDir.resolve("keypair.json").toFile();
        String filePath = file.getAbsolutePath();

        // Save
        KeyStorage.saveKeyPair(keyPair, filePath);
        assertTrue(file.exists());

        // Load
        SDithKeyPair loadedKeyPair = KeyStorage.loadKeyPair(filePath);

        assertNotNull(loadedKeyPair);
        assertArrayEquals(keyPair.getPublicKey().getPublicKey(), loadedKeyPair.getPublicKey().getPublicKey());
        assertArrayEquals(keyPair.getPublicKey().getSyndrome(), loadedKeyPair.getPublicKey().getSyndrome());
        assertArrayEquals(keyPair.getPrivateKey().getSecretKey(), loadedKeyPair.getPrivateKey().getSecretKey());
    }
}
