package com.example.japtube.repository;

import com.example.japtube.modal.TokenConfirm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenConfirmRepository extends JpaRepository<TokenConfirm, Integer> {
    Optional<TokenConfirm> findByToken(String token);
}