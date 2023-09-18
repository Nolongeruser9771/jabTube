package com.example.japtube.repository;

import com.example.japtube.entity.Thumbnail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThumbnailRepository extends JpaRepository<Thumbnail, Integer> {
}