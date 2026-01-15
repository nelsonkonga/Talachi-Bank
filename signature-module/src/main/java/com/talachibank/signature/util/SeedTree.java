package com.talachibank.signature.util;

import org.bouncycastle.crypto.digests.SHAKEDigest;
import org.bouncycastle.util.Arrays;

/**
 * GGM Tree for seed expansion in MPCitH.
 * Used to reveal all seeds except one.
 */
public class SeedTree {
    private final byte[][] tree;
    private final int numLeaves;
    private final int height;

    public SeedTree(byte[] rootSeed, int numLeaves) {
        this.numLeaves = numLeaves;
        this.height = (int) Math.ceil(Math.log(numLeaves) / Math.log(2));
        int totalNodes = (1 << (height + 1)) - 1;
        this.tree = new byte[totalNodes][];
        this.tree[0] = rootSeed;

        expand();
    }

    private void expand() {
        SHAKEDigest shake = new SHAKEDigest(256);
        for (int i = 0; i < (1 << height) - 1; i++) {
            if (tree[i] == null)
                continue;

            byte[] out = new byte[64];
            shake.update(tree[i], 0, tree[i].length);
            shake.doFinal(out, 0, out.length);

            tree[2 * i + 1] = Arrays.copyOfRange(out, 0, 32);
            tree[2 * i + 2] = Arrays.copyOfRange(out, 32, 64);
        }
    }

    public byte[][] getLeaves() {
        byte[][] leaves = new byte[numLeaves][];
        int leafOffset = (1 << height) - 1;
        for (int i = 0; i < numLeaves; i++) {
            leaves[i] = tree[leafOffset + i];
        }
        return leaves;
    }

    public byte[][] getPath(int hiddenIndex) {
        int pathLen = height;
        byte[][] path = new byte[pathLen][];
        int idx = (1 << height) - 1 + hiddenIndex;

        for (int i = 0; i < height; i++) {
            int sibling = ((idx % 2) == 1) ? idx + 1 : idx - 1;
            path[i] = tree[sibling];
            idx = (idx - 1) / 2;
        }
        return path;
    }

    public static byte[][] reconstructLeaves(byte[][] path, int hiddenIndex, int numLeaves) {
        int height = (int) Math.ceil(Math.log(numLeaves) / Math.log(2));
        int totalNodes = (1 << (height + 1)) - 1;
        byte[][] tree = new byte[totalNodes][];

        int idx = (1 << height) - 1 + hiddenIndex;
        for (int i = 0; i < height; i++) {
            int sibling = ((idx % 2) == 1) ? idx + 1 : idx - 1;
            tree[sibling] = path[i];
            idx = (idx - 1) / 2;
        }

        SHAKEDigest shake = new SHAKEDigest(256);
        for (int i = 0; i < (1 << height) - 1; i++) {
            if (tree[i] == null)
                continue;

            byte[] out = new byte[64];
            shake.update(tree[i], 0, tree[i].length);
            shake.doFinal(out, 0, out.length);

            int left = 2 * i + 1;
            int right = 2 * i + 2;
            if (tree[left] == null)
                tree[left] = Arrays.copyOfRange(out, 0, 32);
            if (tree[right] == null)
                tree[right] = Arrays.copyOfRange(out, 32, 64);
        }

        byte[][] leaves = new byte[numLeaves][];
        int leafOffset = (1 << height) - 1;
        for (int i = 0; i < numLeaves; i++) {
            if (i == hiddenIndex)
                continue;
            leaves[i] = tree[leafOffset + i];
        }
        return leaves;
    }
}
