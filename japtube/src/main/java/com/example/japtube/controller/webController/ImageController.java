package com.example.japtube.controller.webController;

import com.example.japtube.entity.UserImage;
import com.example.japtube.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/v1/images")
public class ImageController {
    @Autowired
    private ImageService imageService;

    //1. POST: user post user avatar
    @PostMapping(value = "/avatar/post", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadUserAvatar(@RequestPart(value = "file") MultipartFile file,
                                              @RequestParam Integer userId){
        UserImage userImage = imageService.uploadUserAvatar(file, userId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("image/jpeg"))
                .body(userImage.getData());
    }

    //TODO: Consider if needed
    //2. GET: get user avatar by id
    @GetMapping("/avatar")
    public ResponseEntity<?> getAvatarById(@RequestParam Integer imageId){
        byte[] data = imageService.getUserAvatarById(imageId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("image/jpeg"))
                .body(data);
    }

    //3. GET: Get film thumbnail by id
    @GetMapping("/thumbnail")
    public ResponseEntity<?> getFilmThumbnailById(@RequestParam Integer imageId){
        byte[] data = imageService.getThumbnailById(imageId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("image/jpeg"))
                .body(data);
    }
}
