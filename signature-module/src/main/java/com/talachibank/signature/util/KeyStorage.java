package com.talachibank.signature.util;

import com.talachibank.signature.core.SDithKeyPair;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;

public class KeyStorage {
    private static final ObjectMapper mapper = new ObjectMapper();

    public static void saveKeyPair(SDithKeyPair keyPair, String filePath) throws IOException {
        mapper.writeValue(new File(filePath), keyPair);
    }

    public static SDithKeyPair loadKeyPair(String filePath) throws IOException {
        return mapper.readValue(new File(filePath), SDithKeyPair.class);
    }
}
