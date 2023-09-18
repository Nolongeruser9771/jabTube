package com.example.japtube.repository;

import com.example.japtube.entity.Packages;
import com.example.japtube.entity.UserPackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserPackageRepository extends JpaRepository<UserPackage, Integer> {
    Optional<UserPackage> findByUser_IdAndPackages_IdAndValid(Integer userId, Integer packageId, Boolean valid);

    Optional<UserPackage> findByUser_IdAndValid(Integer id, Boolean valid);

}