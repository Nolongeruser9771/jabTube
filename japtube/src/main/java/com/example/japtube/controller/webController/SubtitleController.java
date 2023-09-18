package com.example.japtube.controller.webController;

import com.example.japtube.entity.Subtitle;
import com.example.japtube.service.SubtitleService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/subtitles")
@AllArgsConstructor
public class SubtitleController {
    @Autowired
    private SubtitleService subtitleService;

    //1. GET: get by video id and lang
    @GetMapping("/read")
    public ResponseEntity<?> getSubtitleByVideoIdAndLang(@RequestParam Integer videoId,
                                                         @RequestParam String lang) {
        byte[] bytes = subtitleService.readSubtitleFile(videoId, lang);
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(bytes);
    }
}
