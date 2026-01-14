package com.schat.schatapi.config;

import com.schat.schatapi.model.ERole;
import com.schat.schatapi.model.Role;
import com.schat.schatapi.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private com.schat.schatapi.repository.UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder encoder;

    @PostConstruct
    public void initializeRoles() {
        logger.info("🔧 Initializing database with default roles and users...");

        try {
            // [FIX] Safe checking for existing roles without crashing
            initializeRoleSafely(ERole.ROLE_USER, "Standard user role");
            initializeRoleSafely(ERole.ROLE_MODERATOR, "Moderator role");
            initializeRoleSafely(ERole.ROLE_ADMIN, "Administrator role");

            // [FIX] Safe checking for users
            initializeDefaultUser("admin", "admin@schat.com", "admin123", ERole.ROLE_ADMIN);
            initializeDefaultUser("user", "user@schat.com", "user123", ERole.ROLE_USER);

            logger.info("✅ Database initialization completed successfully!");
        } catch (Exception e) {
            // [FIX] Log error but DO NOT THROW RuntimeException to avoid System Crash loop
            // This allows the app to start so you can debug the DB connection
            logger.error("⚠️ WARNING: Database initialization failed. Check your DB connection!", e);
        }
    }

    private void initializeRoleSafely(ERole roleEnum, String description) {
        try {
            if (roleRepository.findByName(roleEnum).isEmpty()) {
                Role role = new Role(roleEnum);
                roleRepository.save(role);
                logger.info("   ✓ Role {} created", roleEnum);
            }
        } catch (Exception e) {
            logger.warn("   Could not init role {}: {}", roleEnum, e.getMessage());
        }
    }

    private void initializeDefaultUser(String username, String email, String password, ERole role) {
        try {
            String encodedPassword = encoder.encode(password);

            if (roleRepository.findByName(role).isEmpty()) {
                logger.warn("   Skipping user {} - Role not found", username);
                return;
            }
            Role userRole = roleRepository.findByName(role).get();

            if (!userRepository.existsByUsername(username)) {
                com.schat.schatapi.model.User user = new com.schat.schatapi.model.User(username, email,
                        encodedPassword);
                java.util.Set<Role> roles = new java.util.HashSet<>();
                roles.add(userRole);
                user.setRoles(roles);
                user.setPartyIndex(1);
                userRepository.save(user);
                logger.info("   ✓ User '{}' created", username);
            }
        } catch (Exception e) {
            logger.warn("   Could not init user {}: {}", username, e.getMessage());
        }
    }
}
