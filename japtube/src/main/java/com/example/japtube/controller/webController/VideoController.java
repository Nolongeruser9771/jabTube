package com.example.japtube.controller.webController;

import com.example.japtube.dto.projection.VideoPublic;
import com.example.japtube.dto.projection.WatchedVideoPublic;
import com.example.japtube.service.VideoServerService;
import com.example.japtube.service.VideoService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileUrlResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/v1/videos")
@AllArgsConstructor
@Slf4j
public class VideoController {
    private final VideoService videoService;

    private final VideoServerService videoServerService;

    //1. GET: get video by film id and episode
    @GetMapping("/get-video")
    public ResponseEntity<?> getVideoByFilmIdAndEpisode(@RequestParam("filmId") Integer filmId,
                                                        @RequestParam("ep") Integer episode) {
        VideoPublic video = videoService.getVideoByFilmIdAndEpisode(filmId, episode);
        return ResponseEntity.ok().body(video);
    }

    //2. GET: view Video
    @GetMapping(value = "/watch/video", produces = "application/octet-stream")
    public ResponseEntity<ResourceRegion> readFile(@RequestParam(value = "videoId") Integer videoId,
                                      @RequestHeader(value = "Range", required = false) String Range,
                                      @RequestParam(value = "userId", required = false) Integer userId) throws IOException {
        Path videoPath = videoServerService.viewVideo(videoId, userId, Range);
        FileUrlResource videoResource = new FileUrlResource(String.valueOf(videoPath));

        ResourceRegion resourceRegion = videoServerService.getResourceRegion(videoResource, Range);
        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .contentType(MediaTypeFactory.getMediaType(videoResource).orElse(MediaType.APPLICATION_OCTET_STREAM))
                .body(resourceRegion);
    }

    //3. GET: get all watched videos
    @GetMapping("/watched-videos")
    public ResponseEntity<?> getAllWatchedVideos(@RequestParam("userId") Integer userId) {
        List<WatchedVideoPublic> watchedVideoList = videoService.getAllWatchedVideos(userId);
        return ResponseEntity.ok().body(watchedVideoList);
    }

    //4. GET: get newest videos (video list ordered by createdAtDesc)
    @GetMapping("/all")
    public ResponseEntity<?> getAllVideos() {
        List<VideoPublic> videoList = videoService.getAllPublicVideos();
        return ResponseEntity.ok().body(videoList);
    }

    //5. GET: Get video by id
    @GetMapping("")
    public ResponseEntity<?> getVideoById(@RequestParam("videoId") Integer videoId) {
        VideoPublic video = videoService.getPublicVideoById(videoId, true);
        return ResponseEntity.ok().body(video);
    }
}
