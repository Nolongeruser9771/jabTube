package com.example.japtube.controller.adminController;

import com.example.japtube.dto.projection.VideoPublic;
import com.example.japtube.modal.ResponseObject;
import com.example.japtube.request.VideoUpsertRequest;
import com.example.japtube.service.VideoServerService;
import com.example.japtube.service.VideoService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileUrlResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/videos")
@AllArgsConstructor
@Slf4j
public class VideoAdminController {
    private final VideoServerService videoServerService;

    private final VideoService videoService;

    //1. POST: upload video
    @PostMapping("/upload/chunk")
    public ResponseEntity<?> uploadChunk(@RequestBody MultipartFile file,
                                              @RequestParam Integer filmId,
                                              @RequestParam(required = false) Integer videoId,
                                              @RequestParam Integer chunkIndex,
                                              @RequestParam Integer totalChunks) throws IOException {
        return videoServerService.uploadVideo(filmId, file, chunkIndex, totalChunks, videoId);
    }

    @PostMapping("/upload/initUpload")
    public ResponseEntity<?> initUpload(@RequestParam Integer filmId){
        Integer videoId = videoServerService.initUpload(filmId);
        return ResponseEntity.ok().body(new ResponseObject(HttpStatus.OK, String.valueOf(videoId)));
    }

    //2. GET: get all videos
    @GetMapping(value = "")
    public ResponseEntity<?> getAllVideo(){
        List<VideoPublic> videos = videoService.getAllVideos();
        return ResponseEntity.ok().body(videos);
    }

    //3. GET: Get video by id
    @GetMapping("/search")
    public ResponseEntity<?> getVideoById(@RequestParam Integer videoId){
        VideoPublic video = videoService.getVideoById(videoId);
        return ResponseEntity.ok().body(video);
    }
    //4. GET: view video
    @GetMapping(value = "/preview", produces = "application/octet-stream")
    public ResponseEntity<ResourceRegion> previewVideo(@RequestParam Integer videoId,
                                                       @RequestHeader(value = "Range", required = false) String Range) throws IOException {
        Path videoPath = videoServerService.previewVideo(videoId);
        FileUrlResource videoResource = new FileUrlResource(String.valueOf(videoPath));

        ResourceRegion resourceRegion = videoServerService.getResourceRegion(videoResource, Range);
        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .contentType(MediaTypeFactory.getMediaType(videoResource).orElse(MediaType.APPLICATION_OCTET_STREAM))
                .body(resourceRegion);
    }

    //5. PUT: update video
    @PutMapping("")
    public ResponseEntity<?> updateVideo(@RequestParam Integer videoId,
                                         @RequestBody VideoUpsertRequest request) {
        VideoPublic updatedVideo = videoService.updateVideo(videoId, request);
        return ResponseEntity.ok().body(updatedVideo);
    }

    //6. DELETE: delete video
    @DeleteMapping("")
    public ResponseEntity<?> deleteVideo(@RequestParam Integer videoId){
        videoService.deleteVideo(videoId);
        return ResponseEntity.ok().body(new ResponseObject(HttpStatus.OK, "successfully deleted video id " + videoId));
    }
}
