package com.example.japtube.repository;

import com.example.japtube.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByVideo_IdOrderByCreatedAtDesc(Integer id);

}