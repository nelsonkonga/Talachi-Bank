package com.schat.schatapi.repository;

import com.schat.schatapi.model.User;
import com.schat.schatapi.model.UserKeyPair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserKeyPairRepository extends JpaRepository<UserKeyPair, Long> {

    List<UserKeyPair> findByUser(User user);

    Optional<UserKeyPair> findByUserAndStatusAndSecurityLevel(User user, UserKeyPair.KeyStatus status,
            Integer securityLevel);

    List<UserKeyPair> findByUserAndStatus(User user, UserKeyPair.KeyStatus status);
    
    UserKeyPair findTopByUserAndStatusOrderByCreatedAtDesc(User user, UserKeyPair.KeyStatus status);
}
