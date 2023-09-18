package com.example.japtube.repository;

import com.example.japtube.entity.Packages;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PackageRepository extends JpaRepository<Packages, Integer> {
}