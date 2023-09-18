package com.example.japtube.repository;

import com.example.japtube.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VideoRepository extends JpaRepository<Video, Integer> {
    List<Video> findByStatusOrderByPublishedAtDesc(Boolean status);

    Optional<Video> findByFilm_IdAndEpisodeAndStatus(Integer id, Integer episode, Boolean status);

    Optional<Video> findByFilm_IdAndEpisode(Integer id, Integer episode);

    Optional<Video> findByIdAndStatus(Integer id, Boolean status);

}