package com.example.japtube.repository;

import com.example.japtube.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Integer> {
    List<Note> findByShorts_Id(Integer shortsId);
}