package com.example.japtube.repository;

import com.example.japtube.entity.Subtitle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubtitleRepository extends JpaRepository<Subtitle, Integer> {
    Optional<Subtitle> findByVideo_IdAndLang(Integer id, String lang);
}