package com.example.japtube.service;

import com.example.japtube.dto.projection.ShortsPublic;
import com.example.japtube.entity.Playlist;
import com.example.japtube.entity.Shorts;
import com.example.japtube.entity.User;
import com.example.japtube.entity.Video;
import com.example.japtube.exception.BadRequestException;
import com.example.japtube.exception.FileHandleException;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.repository.PlaylistRepository;
import com.example.japtube.repository.ShortsRepository;
import com.example.japtube.repository.UserRepository;
import com.example.japtube.repository.VideoRepository;
import com.example.japtube.request.ShortsCreateRequest;
import com.example.japtube.request.ShortsUpsertRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Slf4j
public class ShortService {
    @Autowired
    private ShortsRepository shortsRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlaylistRepository playlistRepository;

    @PersistenceContext
    private EntityManager entityManager;

    //get rootPath value from "root-path" application.properties
    @Value("${shorts.root.path}")
    private String shortsRootPath;

    //Create folder to save shorts
    private void createFolder(Path path) {
        //if root folder not existed -> create
        if (Files.notExists(path)) {
            try {
                Files.createDirectories(path);
            }catch (IOException e){
                throw new FileHandleException("Error when creating directory");
            }
        }
    }

    //video cutter
    private String videoCutter(Integer videoId, double startTime, double length, Integer userId){
        //find video by id
        Video video = videoRepository.findByIdAndStatus(videoId, true)
                .orElseThrow(() -> {throw new NotFoundException("Video id " + videoId + " not found");});

        //find video path
        String inputVideoPath = video.getPath();
        if (Files.notExists(Path.of(inputVideoPath))) {
            throw new FileHandleException(inputVideoPath + " not found");
        }
        log.info("inputVideoPath {}", inputVideoPath );

        //create directory to save shorts (outputVideoPath) upload_shorts > userId > shortsId
        String outputShortsDirectory = shortsRootPath + "/user_" + userId;
        createFolder(Path.of(outputShortsDirectory));

        //create outputFilePath
        String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String outputShortsPath = outputShortsDirectory + "/shorts_" + timestamp + ".mp4";

        //path to ffmpeg
        //TODO: Change the ffmpegPath if Packing project by docker
        String ffmpegPath = "C:/ffmpeg/bin/ffmpeg.exe";

        //build up ffmpeg command
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                    ffmpegPath, "-i", inputVideoPath,
                    "-ss", String.valueOf(startTime),
                    "-t", String.valueOf(length),
                    "-c:v", "copy",
                    "-c:a", "copy",
                    outputShortsPath
            );
            processBuilder.start();
            return outputShortsPath;
        }catch (IOException e) {
            throw new FileHandleException("Error occurred when cutting shorts");
        }
    }

    //create shorts
    @Transactional
    public ShortsPublic createShorts(ShortsCreateRequest request){
        //check if user valid
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> {throw new NotFoundException("User id " + request.getUserId() + " not found");});

        //shorts path
        String shortsPath = videoCutter(request.getVideoId(), request.getStartTime(), request.getLength(), request.getUserId());

        //create new shorts
        Shorts newShorts = Shorts.builder()
                .title(request.getTitle() != null ?request.getTitle():"My Shorts")
                .description(request.getDescription() != null? request.getDescription(): "My Shorts")
                .user(user)
                .playlists(new HashSet<>())
                .path(shortsPath)
                .build();
        shortsRepository.save(newShorts);
        return ShortsPublic.of(newShorts);
    }

    //edit shorts
    public ShortsPublic updateShorts(ShortsUpsertRequest request) {
        //find shorts
        Shorts shorts = shortsRepository.findById(request.getShortsId())
                .orElseThrow(() -> {throw new NotFoundException("Shorts Id " + request.getShortsId() + " not found");});
        //find playlists
        if (request.getPlaylistIds()!=null){
            Set<Playlist> updatedPlaylist = playlistRepository.findByIdIn(request.getPlaylistIds());
            shorts.setPlaylists(updatedPlaylist);
        }
        //update shorts
        shorts.setTitle(request.getTitle()!=null? request.getTitle(): shorts.getTitle());
        shorts.setDescription(request.getDescription()!=null? request.getDescription() : shorts.getDescription());
        shortsRepository.save(shorts);
        return ShortsPublic.of(shorts);
    }

    //view shorts
    public ShortsPublic getShortsById(Integer shortsId, Integer userId) {
        //find shorts
        Shorts shorts = shortsRepository.findById(shortsId)
                .orElseThrow(() -> {throw new NotFoundException("Shorts Id " + shortsId + " not found");});

        //check userId
        if (userId != shorts.getUser().getId()) {
            throw new BadRequestException("User id " + userId + " do not own shorts id " + shortsId);
        }
        return ShortsPublic.of(shorts);
    }

    //get all shorts of users
    public List<ShortsPublic> getAllShortsOfUser(Integer userId){
        List<Shorts> shortsList = shortsRepository.findByUser_Id(userId);
        return shortsList.stream()
                .map(ShortsPublic::of)
                .toList();
    }

    //delete shorts
    //delete shorts => delete all notes related, not affect playlist, just remove the link between
    @Transactional
    public void deleteShorts(Integer shortsId){
        //find shorts
        Shorts shorts = shortsRepository.findById(shortsId)
                .orElseThrow(() -> {throw new NotFoundException("Shorts Id " + shortsId + " not found");});
        try {
            entityManager.remove(shorts);
            entityManager.clear();
            shortsRepository.delete(shorts);
        } catch (Exception e) {
            throw new RuntimeException("Delete error!");
        }
    }

    //view shorts
    public Path viewShorts(Integer shortsId, Integer userId){
        //find shorts
        Shorts shorts = shortsRepository.findById(shortsId)
                .orElseThrow(() -> {throw new NotFoundException("Shorts id " + shortsId + " not found");});
        //check userId
        if (userId != shorts.getUser().getId()) {
            throw new BadRequestException("User id " + userId + " do not own shorts id " + shortsId);
        }
        //validate path
        if (Files.notExists(Path.of(shorts.getPath()))){
                throw new NotFoundException(shorts.getPath() + " not found");
        }
        return Path.of(shorts.getPath());
    }

    //TODO: Xóa shorts
}
