package com.talachibank.api.repository;

import com.talachibank.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByAccountNumber(String accountNumber);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
