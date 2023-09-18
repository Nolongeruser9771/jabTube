package com.example.japtube.service;

import com.example.japtube.entity.Film;
import com.example.japtube.entity.User;
import com.example.japtube.entity.Video;
import com.example.japtube.entity.WatchedVideo;
import com.example.japtube.modal.ResponseObject;
import com.example.japtube.exception.BadRequestException;
import com.example.japtube.exception.FileHandleException;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.repository.FilmRepository;
import com.example.japtube.repository.UserRepository;
import com.example.japtube.repository.VideoRepository;
import com.example.japtube.repository.WatchedVideoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.FileUrlResource;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

import static org.apache.commons.lang3.math.NumberUtils.min;

@RequiredArgsConstructor
@Slf4j
@Service
public class VideoServerService {

    private final VideoRepository videoRepository;

    private final WatchedVideoRepository watchedVideoRepository;

    private final UserRepository userRepository;

    private final FilmRepository filmRepository;

    private static final long CHUNK_SIZE = 1024 * 1024; //1MB

    private final com.example.japtube.utils.FileUtils fileUtils;

    //upload first chunk to get videoId
    @Transactional
    public Integer initUpload(Integer filmId){
        //find filmId
        Film film = filmRepository.findById(filmId)
                .orElseThrow(()-> {throw new NotFoundException("Film id " + filmId + " not found");});

        //create new video to get videoId
        Video video =  Video.builder()
                    .film(film)
                    .isFree(false)
                    .status(false)
                    .title("Video")
                    .episode(0)
                    .views(0)
                    .build();
        videoRepository.save(video);

        //find film and update film
        film.setUpdatedAt(LocalDateTime.now());
        if (film.getStatus()) {
            film.setPublishedAt(LocalDateTime.now());
        }
        filmRepository.save(film);
        return video.getId();
    }

    @Transactional
    public ResponseEntity<?> uploadVideo(Integer filmId, MultipartFile file, Integer chunkIndex, Integer totalChunks, Integer videoId) throws IOException {
        //find filmId
        filmRepository.findById(filmId)
                .orElseThrow(()-> {throw new NotFoundException("Film id " + filmId + " not found");});

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> {throw new NotFoundException("Video not found");});
        
        //update
        Path uploadFilePath = Path.of("upload_videos/filmId_" + filmId + "/video_" + videoId);
        Path temporaryUploadFilePath = Path.of("upload_videos/filmId_" + filmId + "/video_" + videoId + "/temporary_load");

        if (Files.notExists(temporaryUploadFilePath)){
            Files.createDirectories(temporaryUploadFilePath);
        }
        if (Files.notExists(uploadFilePath)) {
            Files.createDirectories(uploadFilePath);
        }

        //write temporary files
        Path chunkPath = temporaryUploadFilePath.resolve("chunk-" + chunkIndex);
        Files.write(chunkPath, file.getBytes());

        if (chunkIndex == totalChunks - 1) {
            Path videoPath = uploadFilePath.resolve("video_" + videoId + ".mp4");
            File videoUpload = new File(videoPath.toString());

            try (OutputStream outputStream = new FileOutputStream(videoUpload)) {
                for (int i = 0; i < totalChunks; i++) {
                    Path currentChunkPath = temporaryUploadFilePath.resolve("chunk-" + i);
                    byte[] chunkData = Files.readAllBytes(currentChunkPath);
                    outputStream.write(chunkData);
                }
                // Clean up processed chunk
                FileUtils.deleteDirectory(new File(String.valueOf(temporaryUploadFilePath)));
                outputStream.close();
                log.info("uploaded");

                //set video path
                setVideoSizeAndDuration(video, String.valueOf(videoPath));
                video.setType(file.getContentType());

                return ResponseEntity.ok(new ResponseObject(HttpStatus.OK, String.valueOf(videoPath)));
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file");
            }
        }
        return ResponseEntity.ok().body(new ResponseObject(HttpStatus.PARTIAL_CONTENT, "Chunk " + chunkIndex + " upload success!"));
    }

    //set video size and duration
    private void setVideoSizeAndDuration(Video video, String videoPath){
        String ffmpegPath = "C:/ffmpeg/bin/ffmpeg.exe";

        //build up ffmpeg command
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                    ffmpegPath, "-i", videoPath
            );
            Process process = processBuilder.start();
            InputStream inputStream = process.getErrorStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));

            String line;
            String duration = "";

            //read through the command result and get size & length
            while ((line = reader.readLine()) != null) {
                if (line.contains("Duration")) {
                    duration = line.split("Duration: ")[1].split(",")[0];
                }
            }

            reader.close();
            inputStream.close();

            String[] timeParts = duration.split(":");

            int hours = Integer.parseInt(timeParts[0]);
            int minutes = Integer.parseInt(timeParts[1]);

            double secondsWithMillis = Double.parseDouble(timeParts[2]);
            int seconds = (int) secondsWithMillis;
            int milliseconds = (int) ((secondsWithMillis - seconds) * 1000);

            LocalTime localTime = LocalTime.of(hours, minutes, seconds, milliseconds * 1000000);

            String urlResource = String.valueOf(Paths.get(videoPath));
            FileUrlResource fileUrlResource = new FileUrlResource(urlResource);

            video.setDuration(localTime);
            video.setSize(fileUrlResource.contentLength());
            video.setPath(videoPath);
            videoRepository.save(video);

        }catch (IOException e) {
            throw new FileHandleException("Error when calculating files");
        }
    }

    //get video
    public Path viewVideo(Integer videoId, Integer userId, String range) {
        //find video by id
        Video video = videoRepository.findByIdAndStatus(videoId, true)
                .orElseThrow(() -> {
                    throw new NotFoundException("Video id " + videoId + " not found");});

        Path videoPath = Path.of(video.getPath());
        //Validate filePath : if filepath existed?
        if (Files.notExists(videoPath)) {
            throw new NotFoundException("Video path = " + videoPath + " not found");
        }

        if (StringUtils.isNotBlank(range)) {
            String[] ranges = range.substring("bytes=".length()).split("-");
            int fromRange = Integer.parseInt(ranges[0]);
            if (fromRange == 0) {
                //update views for video
                video.setViews(video.getViews() + 1);
                videoRepository.save(video);
            }
        }

        //validate userId: if userId exist?
        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> {
                        throw new NotFoundException("User id " + userId + " not found");
                    });

            //check if video watched?
            Optional<WatchedVideo> watchedVideo = watchedVideoRepository.findByVideo_IdAndUser_Id(videoId, userId);

            //if user already watched ->  update watchedAt(now), and video;
            if (watchedVideo.isPresent()) {
                watchedVideo.get().setWatchedAt(LocalDateTime.now());
                watchedVideo.get().setVideo(video);
                watchedVideoRepository.save(watchedVideo.get());
            } else {
                //if not watched yet
                WatchedVideo newWatchedVideo = WatchedVideo.builder()
                        .video(video)
                        .user(user)
                        .build();
                watchedVideoRepository.save(newWatchedVideo);
            }
        }
        return videoPath;
    }

    //admin task: view video
    public Path previewVideo(Integer videoId) {
        //find video by id
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> {
                    throw new NotFoundException("Video id " + videoId + " not found");
                });

        Path videoPath = Paths.get(video.getPath());
        //Validate filePath : if filepath existed?
        if (Files.notExists(videoPath)) {
            throw new NotFoundException("Video path = " + videoPath + " not found");
        }
        return videoPath;
    }

    //TODO: Load by chunk
    public ResourceRegion getResourceRegion(UrlResource video, String range) throws IOException {
        ResourceRegion resourceRegion = null;

        long contentLength = video.contentLength();
        int fromRange = 0;
        int toRange = 0;
        if (StringUtils.isNotBlank(range)) {
            String[] ranges = range.substring("bytes=".length()).split("-");
            fromRange = Integer.parseInt(ranges[0]);
            log.info(String.valueOf(fromRange));
            if (ranges.length > 1) {
                toRange = Integer.parseInt(ranges[1]);
                log.info(String.valueOf(toRange));
            } else {
                toRange = (int) (contentLength - 1);
                log.info(String.valueOf(toRange));
            }
        }

        if (fromRange > 0) {
            long rangeLength = min(CHUNK_SIZE, toRange - fromRange + 1);
            resourceRegion = new ResourceRegion(video, fromRange, rangeLength);
        } else {
            long rangeLength = min(CHUNK_SIZE, contentLength);
            resourceRegion = new ResourceRegion(video, 0, rangeLength);
        }
        return resourceRegion;
    }

}
