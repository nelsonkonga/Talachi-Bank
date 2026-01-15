package com.talachibank.signature.core;

/**
 * Public Key for SDitH Scheme.
 */
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class SDithPublicKey {
    private final byte[] seedH;
    private final byte[] syndrome;
    private final SDitHParameters params;

    @JsonCreator
    public SDithPublicKey(
            @JsonProperty("publicKey") byte[] seedH,
            @JsonProperty("syndrome") byte[] syndrome,
            @JsonProperty("params") SDitHParameters params) {
        this.seedH = seedH;
        this.syndrome = syndrome;
        this.params = params;
    }

    public byte[] getPublicKey() {
        return seedH;
    }

    public byte[] getSyndrome() {
        return syndrome;
    }

    public SDitHParameters getParams() {
        return params;
    }
}
