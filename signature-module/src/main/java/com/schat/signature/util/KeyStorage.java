package com.schat.signature.util;

import com.schat.signature.core.SDithKeyPair;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.security.PrivateKey;
import java.security.PublicKey;

public class KeyStorage {
    private static final ObjectMapper mapper = new ObjectMapper();

    public static void saveKeyPair(SDithKeyPair keyPair, String filePath) throws IOException {
        try (FileOutputStream fos = new FileOutputStream(filePath);
             ObjectOutputStream oos = new ObjectOutputStream(fos)) {
            oos.writeObject(keyPair);
        }
    }

    public static SDithKeyPair loadKeyPair(String filePath) throws IOException, ClassNotFoundException {
        try (FileInputStream fis = new FileInputStream(filePath);
             ObjectInputStream ois = new ObjectInputStream(fis)) {
            return (SDithKeyPair) ois.readObject();
        }
    }
}
