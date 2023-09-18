package com.example.japtube.service;

import com.example.japtube.entity.Subtitle;
import com.example.japtube.entity.Video;
import com.example.japtube.exception.FileHandleException;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.repository.SubtitleRepository;
import com.example.japtube.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubtitleService {
    @Autowired
    private SubtitleRepository subtitleRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Value("${video.root.path}")
    private String videoRootPath;

    //create directories to save subtitle file
    private void createFolder(Path path){
        if (Files.notExists(path)) {
            try {
                Files.createDirectories(path);
            } catch (IOException e) {
                throw new FileHandleException("Error when creating folder");
            }
        }
    }

    //admin task: upload subtitle file
    public String uploadSubtitle(Integer videoId, String lang, MultipartFile file){
        //TODO: validate file

        //find video - find film
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> { throw new NotFoundException("Video id " + videoId + " not found");});

        Path storagePath = Path.of(videoRootPath + "/filmId_" + video.getFilm().getId() + "/video_" + video.getId() + "/subtitle");
        //create directories to subtitle file
        createFolder(storagePath);

        //TODO: Check if subtitle of same videoId, same lang existed?
        //save subtitle file
        String subtitleFileName = "sub_" + lang;
        Path targetFilePath;
        try {
            targetFilePath = storagePath.resolve(subtitleFileName);
            Files.copy(file.getInputStream(), targetFilePath, StandardCopyOption.REPLACE_EXISTING);
        }catch (IOException e) {
            throw new FileHandleException("Error occurred when saving subtitle files");
        }
        //find subtitle
        Optional<Subtitle> subtitle = subtitleRepository.findByVideo_IdAndLang(videoId, lang);

        //is no subtitle file available => create
        if (subtitle.isEmpty()) {
            Subtitle newSubtitle = Subtitle.builder()
                    .title(subtitleFileName)
                    .lang(lang)
                    .video(video)
                    .path(String.valueOf(targetFilePath))
                    .build();
            subtitleRepository.save(newSubtitle);
            //return url to read subtitle file;
            return "/api/v1/subtitles/read?videoId=" + video.getId() + "&lang=" + lang;
        }

        //update updatedAt
        subtitle.get().setPath(String.valueOf(targetFilePath));
        subtitle.get().setUpdatedAt(LocalDateTime.now());
        subtitleRepository.save(subtitle.get());
        return "/api/v1/subtitles/read?videoId=" + video.getId() + "&lang=" + lang;
    }

    //get subtitles by lang and videoId
    public byte[] readSubtitleFile(Integer videoId, String lang){
        //find subtitle
        Subtitle subtitle = subtitleRepository.findByVideo_IdAndLang(videoId, lang).stream().findFirst()
                .orElseThrow(() -> {throw new NotFoundException(lang + " subtitle of video id " + videoId + " not found");});

        //get path and check if path existed
        if (Files.notExists(Path.of(subtitle.getPath()))) {
            throw new NotFoundException(subtitle.getPath() + "not found");
        }
        try {
            return Files.readAllBytes(Path.of(subtitle.getPath()));
        } catch (IOException e) {
            throw new FileHandleException("Error when reading" + lang + " subtitle file of video id " + videoId);
        }
    }

    //admin task: delete file sub
    public void deleteSubFile(Integer videoId, String lang) {
        //find sub
        Subtitle subtitle = subtitleRepository.findByVideo_IdAndLang(videoId, lang)
                .orElseThrow(()->{throw new NotFoundException("Subtitle file not found");});

        //find video
        Video video = videoRepository.findById(videoId)
                .orElseThrow(()->{throw new NotFoundException("Subtitle file not found");});

        //remove sub of this video
        video.getSubtitles().remove(subtitle);

        //delete sub
        subtitleRepository.delete(subtitle);
    }
}
