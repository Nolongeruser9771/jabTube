package com.example.japtube.service;

import com.example.japtube.dto.projection.PackagePublic;
import com.example.japtube.entity.Packages;
import com.example.japtube.entity.User;
import com.example.japtube.entity.UserPackage;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.repository.UserPackageRepository;
import com.example.japtube.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PackageService {
    @Autowired
    private UserPackageRepository userPackageRepository;

    //1. Get User Package
    public PackagePublic getPackageByUserId(Integer userId) {
        UserPackage userPackage = userPackageRepository.findByUser_IdAndValid(userId, true)
                .orElseThrow(() -> {throw new NotFoundException("Not found any package from user id " + userId );});
        return PackagePublic.of(userPackage);
    }
}
