package com.example.japtube.controller.adminController;

import com.example.japtube.modal.ResponseObject;
import com.example.japtube.service.SubtitleService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/subtitles")
@AllArgsConstructor
public class SubtitleAdminController {
    @Autowired
    private SubtitleService subtitleService;

    //1. POST: Upload subtitle file
    @PostMapping(value = "/upload")
    public ResponseEntity<?> uploadSubtitleFile(@RequestParam Integer videoId, @RequestParam String lang, @RequestBody MultipartFile file){
        String apiUrl = subtitleService.uploadSubtitle(videoId, lang, file);
        return ResponseEntity.ok().body(new ResponseObject(HttpStatus.OK, apiUrl));
    }

    //2. DELETE: delete subfile
    @DeleteMapping("")
    public ResponseEntity<?> deleteSubFile(@RequestParam Integer videoId, @RequestParam String lang){
        subtitleService.deleteSubFile(videoId, lang);
        return ResponseEntity.ok().body(new ResponseObject(HttpStatus.OK, "Delete success!"));
    }
}
