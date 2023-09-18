package com.example.japtube.repository;

import com.example.japtube.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByIdIn(List<Integer> categoryIdList);

    List<Category> findByFilms_Id(Integer id);

    List<Category> findByNameAllIgnoreCase(String name);

}