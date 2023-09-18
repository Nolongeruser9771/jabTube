package com.example.japtube.repository;

import com.example.japtube.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Boolean existsByEmail(String email);

    List<User> findByRoles_Role(String role);

    List<User> findByRoles_RoleNot(String role);

    List<User> findByCreateAtBetween(LocalDateTime createAtStart, LocalDateTime createAtEnd);

    List<User> findByVipActiveTrueAndCreateAtBetween(LocalDateTime createAtStart, LocalDateTime createAtEnd);

    List<User> findByVipActive(Boolean vipActive);

    Optional<User> findByEmail(String email);
}