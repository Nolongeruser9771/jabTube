package com.example.japtube.controller.adminController;

import com.example.japtube.modal.ResponseObject;
import com.example.japtube.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/v1/admin/images")
public class ImageAdminController {

    @Autowired
    private ImageService imageService;

    //1. POST: Post film thumbnail
    @PostMapping(value = "/thumbnail/post")
    public ResponseEntity<?> uploadThumbnail(@RequestBody MultipartFile file){
        String thumbnail = imageService.uploadThumbnail(file);
        return ResponseEntity.ok()
                .body(new ResponseObject(HttpStatus.OK, thumbnail));
    }

}
