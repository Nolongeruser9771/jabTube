package com.example.japtube.repository;

import com.example.japtube.dto.projection.FilmPublic;
import com.example.japtube.entity.Film;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface FilmRepository extends JpaRepository<Film, Integer> {
    List<Film> findByLevelAndStatusOrderByPublishedAtDesc(String level, Boolean status);

    List<Film> findByStatusOrderByPublishedAtDesc(Boolean status);

    Optional<Film> findByIdAndStatus(Integer id, Boolean status);

    List<Film> findByTitleContainsAndStatusOrderByPublishedAtDesc(String title, Boolean status);

    List<Film> findByStatus(Boolean status);

    List<Film> findByCategories_IdAndStatus(Integer id, Boolean status);

    List<Film> findByCategories_IdInAndStatusOrderByPublishedAtDesc(List<Integer> ids, Boolean status);

    List<Film> findByOrderByPublishedAtDesc();

}