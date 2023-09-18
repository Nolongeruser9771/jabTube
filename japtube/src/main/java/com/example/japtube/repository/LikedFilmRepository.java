package com.example.japtube.repository;

import com.example.japtube.entity.Film;
import com.example.japtube.entity.LikedFilm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

public interface LikedFilmRepository extends JpaRepository<LikedFilm, Integer> {
    Optional<LikedFilm> findByUser_IdAndFilm_Id(Integer userId, Integer filmId);

    List<LikedFilm> findByUser_IdAndFilm_StatusOrderByLikedAtDesc(Integer id, Boolean status);

    List<LikedFilm> findByFilm_Id(Integer id);


}