package com.talachibank.api.service;

import com.talachibank.api.dto.JwtResponse;
import com.talachibank.api.repository.UserRepository;
import com.talachibank.api.repository.UserKeyPairRepository;
import com.talachibank.api.model.User;
import com.talachibank.api.model.UserKeyPair;
import com.talachibank.api.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    SDitHTokenService sdithTokenService;

    @Autowired
    UserKeyPairRepository userKeyPairRepository;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthService.class);

    public JwtResponse authenticateUser(String username, String password) {
        logger.info("Attempting authentication for user: {}", username);
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String jwt = jwtUtils.generateJwtToken(userDetails.getUsername());
            logger.info("Authentication successful for user: {}", username);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            logger.info("Token generated successfully for user: {}", username);
            return new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
                    userDetails.getEmail(), roles, null, userDetails.getBalance(), userDetails.getAccountNumber());
        } catch (Exception e) {
            logger.error("Authentication failed for user: {} - Reason: {}", username, e.getMessage());
            e.printStackTrace(); // Print full stack trace for debugging
            throw e;
        }
    }

    @Autowired
    com.talachibank.api.repository.RoleRepository roleRepository;

    /**
     * Register a new user with the specified username, email, password, and roles.
     * 
     * <p>
     * This method:
     * <ul>
     * <li>Validates that username and email are not already taken</li>
     * <li>Creates a new user account with encoded password</li>
     * <li>Assigns roles based on the provided role strings</li>
     * <li>Assigns a party index for threshold signing (round-robin: 1-3)</li>
     * <li>Persists the user to the database</li>
     * </ul>
     * 
     * <p>
     * <b>Role Assignment Logic:</b>
     * <ul>
     * <li>If no roles provided (null): assigns ROLE_USER by default</li>
     * <li>Role string "admin": assigns ROLE_ADMIN</li>
     * <li>Role string "mod": assigns ROLE_MODERATOR</li>
     * <li>Any other string: assigns ROLE_USER</li>
     * </ul>
     * 
     * @param username The desired username (must be unique)
     * @param email    The user's email address (must be unique)
     * @param password The user's password (will be encoded with BCrypt)
     * @param strRoles Set of role strings ("admin", "mod", or any other value
     *                 defaults to user role)
     * @return The created and persisted User entity
     * @throws RuntimeException if username or email already exists, or if required
     *                          roles are not found in DB
     */
    public User registerUser(String username, String email, String password, Set<String> strRoles) {
        logger.info("Attempting registration for user: {}, email: {}", username, email);
        if (userRepository.existsByUsername(username)) {
            logger.warn("Registration failed: Username {} is already taken!", username);
            throw new RuntimeException("❌Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(email)) {
            logger.warn("Registration failed: Email {} is already in use!", email);
            throw new RuntimeException("❌Error: Email is already in use!");
        }

        // Creating new user's account..
        User user = new User(username, email, encoder.encode(password));

        // Generate a random 10-digit account number (e.g., TAL-1234567890)
        String accNum = "TAL-" + (long) (Math.random() * 9_000_000_000L + 1_000_000_000L);
        user.setAccountNumber(accNum);

        // Initial balance is set to 0.00 for new users
        user.setBalance(java.math.BigDecimal.ZERO);

        Set<com.talachibank.api.model.Role> roles = new HashSet<>();

        if (strRoles == null) {
            com.talachibank.api.model.Role userRole = roleRepository
                    .findByName(com.talachibank.api.model.ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        com.talachibank.api.model.Role adminRole = roleRepository
                                .findByName(com.talachibank.api.model.ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "mod":
                        com.talachibank.api.model.Role modRole = roleRepository
                                .findByName(com.talachibank.api.model.ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        break;
                    default:
                        com.talachibank.api.model.Role userRole = roleRepository
                                .findByName(com.talachibank.api.model.ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);

        userRepository.save(user);

        // Generate SDITH Key Pair (Level L1 - 128 bit)
        try {
            com.talachibank.signature.core.SDithKeyPair sdithKeyPair = sdithTokenService
                    .generateKeyPair(com.talachibank.signature.core.SDitHParameters.LEVEL_L1);
            UserKeyPair keyPairEntity = UserKeyPair.builder()
                    .user(user)
                    .publicKey(sdithKeyPair.getPublicKey().getPublicKey())
                    .syndrome(sdithKeyPair.getPublicKey().getSyndrome())
                    .privateKeyEncrypted(sdithKeyPair.getPrivateKey().getSecretKey())
                    .securityLevel(128)
                    .status(UserKeyPair.KeyStatus.ACTIVE)
                    .build();

            if (keyPairEntity != null) {
                userKeyPairRepository.save(keyPairEntity);
                logger.info("SDitH Key Pair generated and saved for user: {}", username);
            }
        } catch (Exception e) {
            logger.error("Failed to generate SDitH keys for user: {}", username, e);
        }

        logger.info("User registered successfully: {}", username);
        return user;
    }

    public void logoutUser() {
        // Simple logout (client clears JWT)
        SecurityContextHolder.clearContext();
    }
}
