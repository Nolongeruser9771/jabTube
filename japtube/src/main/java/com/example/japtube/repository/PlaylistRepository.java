package com.example.japtube.repository;

import com.example.japtube.entity.Playlist;
import com.example.japtube.entity.Shorts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface PlaylistRepository extends JpaRepository<Playlist, Integer> {
    List<Playlist> findByUser_Id(Integer userId);

    Set<Playlist> findByIdIn(List<Integer> playlistIds);
}