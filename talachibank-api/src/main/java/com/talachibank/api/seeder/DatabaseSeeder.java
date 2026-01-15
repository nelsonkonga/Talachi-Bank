package com.talachibank.api.seeder;

import com.talachibank.api.model.ERole;
import com.talachibank.api.model.Role;
import com.talachibank.api.model.User;
import com.talachibank.api.model.UserKeyPair;
import com.talachibank.api.repository.UserKeyPairRepository;
import com.talachibank.api.repository.UserRepository;
import com.talachibank.api.repository.RoleRepository;
import com.talachibank.api.service.SDitHTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private UserKeyPairRepository userKeyPairRepository;

    @Autowired
    private SDitHTokenService sdithTokenService;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("--- TALACHI BANK DATABASE SEEDING ---");

        seedRoles();
        seedAdminUser();
        seedDefaultUsers();
        seedKeysForAll();

        System.out.println("--- SEEDING COMPLETED ---");
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(ERole.ROLE_USER));
            roleRepository.save(new Role(ERole.ROLE_MODERATOR));
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
            System.out.println("Roles seeded.");
        }
    }

    private void seedAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User("admin", "admin@talachibank.com", encoder.encode("Admin123!"));
            admin.setAccountNumber("TAL-0000000001");
            admin.setBalance(new BigDecimal("100000.00"));

            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("Admin user seeded: " + admin.getAccountNumber());
        }
    }

    private void seedDefaultUsers() {
        if (!userRepository.existsByUsername("user")) {
            User user = new User("user", "user@talachibank.com", encoder.encode("User123!"));
            user.setAccountNumber("TAL-5000488934");
            user.setBalance(new BigDecimal("10000.00"));
            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName(ERole.ROLE_USER).get());
            user.setRoles(roles);
            userRepository.save(user);
        }
    }

    private void seedKeysForAll() {
        userRepository.findAll().forEach(user -> {
            if (userKeyPairRepository.findByUser(user).isEmpty()) {
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
                    userKeyPairRepository.save(java.util.Objects.requireNonNull(keyPairEntity));
                    System.out.println("Seeded keys for: " + user.getUsername());
                } catch (Exception e) {
                    System.err.println("Failed to seed keys for " + user.getUsername());
                }
            }
        });
    }
}
