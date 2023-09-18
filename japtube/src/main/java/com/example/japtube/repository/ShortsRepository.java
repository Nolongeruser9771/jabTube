package com.example.japtube.repository;

import com.example.japtube.entity.Shorts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShortsRepository extends JpaRepository<Shorts, Integer> {
    List<Shorts> findByUser_Id(Integer userId);
}