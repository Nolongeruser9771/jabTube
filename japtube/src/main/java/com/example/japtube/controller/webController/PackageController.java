package com.example.japtube.controller.webController;

import com.example.japtube.dto.projection.PackagePublic;
import com.example.japtube.service.PackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/packages")
public class PackageController {
    @Autowired
    private PackageService packageService;

    //1. GET: get package of user by userId, //valid only
    @GetMapping("")
    public ResponseEntity<?> getPackagesByUserId(@RequestParam Integer userId) {
        PackagePublic packagePublics = packageService.getPackageByUserId(userId);
        return ResponseEntity.ok().body(packagePublics);
    }
}
