package com.example.japtube.repository;

import com.example.japtube.entity.Video;
import com.example.japtube.entity.WatchedVideo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface WatchedVideoRepository extends JpaRepository<WatchedVideo, Integer> {

    List<WatchedVideo> findByUser_IdAndVideo_StatusOrderByWatchedAtDesc(Integer id, Boolean status);

    Optional<WatchedVideo> findByVideo_IdAndUser_Id(Integer videoId, Integer userId);

    List<WatchedVideo> findByVideo_IdIn(Collection<Integer> ids);

    Optional<WatchedVideo> findByVideo_Id(Integer id);

    List<WatchedVideo> findByWatchedAtBetween(LocalDateTime watchedAtStart, LocalDateTime watchedAtEnd);



}