package com.example.japtube.repository;

import com.example.japtube.modal.TokenVerify;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenVerifyRepository extends JpaRepository<TokenVerify, Integer> {
    Optional<TokenVerify> findByToken(String token);
}