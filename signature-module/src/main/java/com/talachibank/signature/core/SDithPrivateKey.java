package com.talachibank.signature.core;

/**
 * Private Key for SDitH Scheme.
 */
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class SDithPrivateKey {
    private final byte[] e; // error vector
    private final SDitHParameters params;

    @JsonCreator
    public SDithPrivateKey(
            @JsonProperty("secretKey") byte[] e,
            @JsonProperty("params") SDitHParameters params) {
        this.e = e;
        this.params = params;
    }

    public byte[] getSecretKey() {
        return e;
    }

    public SDitHParameters getParams() {
        return params;
    }
}
