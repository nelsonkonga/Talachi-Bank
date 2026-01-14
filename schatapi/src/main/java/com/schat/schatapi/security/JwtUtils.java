package com.schat.schatapi.security;

import com.schat.schatapi.service.SDitHTokenService;
import com.schat.schatapi.service.TokenBlacklistService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${schat.app.jwtSecret}")
    private String jwtSecret;

    @Value("${schat.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @Value("${schat.app.jwtRefreshExpirationMs}")
    private int jwtRefreshExpirationMs;

    @Autowired
    private SDitHTokenService tokenService;

    @Autowired
    private TokenBlacklistService blacklistService;

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateJwtToken(String username) {
        try {
            logger.info("Starting JWT generation for user: {}", username);

            String unsignedToken = Jwts.builder()
                    .subject(username)
                    .issuedAt(new Date())
                    .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                    .signWith(getSigningKey())
                    .compact();

            // Sign with SDitH (Post-Quantum)
            String signedToken = tokenService.signToken(unsignedToken);
            logger.info("Token signed successfully with SDitH signature");

            return signedToken;
        } catch (Exception e) {
            logger.error("JWT generation failed: {}", e.getMessage(), e);
            throw new RuntimeException("Token signing failed: " + e.getMessage(), e);
        }
    }

    public String generateRefreshToken(String username) {
        String unsignedToken = Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtRefreshExpirationMs))
                .signWith(getSigningKey())
                .compact();

        return tokenService.signToken(unsignedToken);
    }

    public boolean validateJwtToken(String authToken) {
        try {
            if (blacklistService.isBlacklisted(authToken)) {
                logger.warn("Token is blacklisted");
                return false;
            }

            // 1. Verify SDitH Signature
            if (authToken.contains("::")) {
                if (!tokenService.verifyTokenSignature(authToken)) {
                    logger.error("Invalid SDitH signature");
                    return false;
                }
            }

            // 2. Validate Standard JWT
            String unsignedToken = tokenService.extractUnsignedToken(authToken);

            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(unsignedToken);

            return true;
        } catch (SecurityException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage(), e);
        }
        return false;
    }

    public String getUserNameFromJwtToken(String token) {
        if (!tokenService.verifyTokenSignature(token)) {
            throw new SecurityException("Invalid token signature");
        }

        String unsignedToken = tokenService.extractUnsignedToken(token);

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(unsignedToken)
                .getPayload()
                .getSubject();
    }
}
