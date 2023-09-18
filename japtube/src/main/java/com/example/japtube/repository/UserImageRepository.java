package com.example.japtube.repository;

import com.example.japtube.entity.UserImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserImageRepository extends JpaRepository<UserImage, Integer> {
    Optional<UserImage> findByUser_Id(Integer id);

}