package com.example.japtube.service;

import com.example.japtube.dto.projection.VideoPublic;
import com.example.japtube.dto.projection.WatchedVideoPublic;
import com.example.japtube.entity.Film;
import com.example.japtube.entity.Video;
import com.example.japtube.entity.WatchedVideo;
import com.example.japtube.exception.BadRequestException;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.repository.FilmRepository;
import com.example.japtube.repository.LikedFilmRepository;
import com.example.japtube.repository.VideoRepository;
import com.example.japtube.repository.WatchedVideoRepository;
import com.example.japtube.request.VideoUpsertRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
public class VideoService {
    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private WatchedVideoRepository watchedVideoRepository;

    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    private FilmRepository filmRepository;

    //get video by film id and episode
    public VideoPublic getPublicVideoById(Integer videoId, boolean b) {
        Video video = videoRepository.findByIdAndStatus(videoId,true)
                .orElseThrow(() -> new NotFoundException("Video id "+ videoId + " not found"));
        return VideoPublic.of(video);
    }

    //Admin task: get video by film id and episode
    public VideoPublic getVideoById(Integer videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new NotFoundException("Video id "+ videoId + " not found"));
        return VideoPublic.of(video);
    }

    //get all watched videos
    public List<WatchedVideoPublic> getAllWatchedVideos(Integer userId) {
        List<WatchedVideo> watchedVideos = watchedVideoRepository.findByUser_IdAndVideo_StatusOrderByWatchedAtDesc(userId, true);
        return watchedVideos.stream()
                .map(WatchedVideoPublic::of)
                .toList();
    }

    //get all videos ordered by createdAt
    public List<VideoPublic> getAllPublicVideos() {
        List<Video> videos = videoRepository.findByStatusOrderByPublishedAtDesc(true);
        return videos.stream()
                .map(VideoPublic::of)
                .limit(10)
                .toList();
    }

    //admin task:  get all videos
    public List<VideoPublic> getAllVideos() {
        List<Video> videos = videoRepository.findAll();
        return videos.stream()
                .map(VideoPublic::of)
                .toList();
    }

    //get video by film id and episode
    public VideoPublic getVideoByFilmIdAndEpisode(Integer videoId, Integer episode) {
        Video video = videoRepository.findByFilm_IdAndEpisodeAndStatus(videoId, episode, true)
                .orElseThrow(() -> {throw new NotFoundException(("Video ep " + episode + " of video id " + videoId + " not found"));});
        return VideoPublic.of(video);
    }

    //admin task: update Video
    public VideoPublic updateVideo(Integer videoId, VideoUpsertRequest request) {
        //find video
        Video video2Update = videoRepository.findById(videoId)
                .orElseThrow(()-> {throw new NotFoundException("Video id " + videoId + " not found");});

        //update
        video2Update.setTitle(request.getTitle());
        if (video2Update.getStatus()!=null) {
            video2Update.setStatus(request.getStatus());
        }
        if (video2Update.getIsFree()!=null) {
            video2Update.setIsFree(request.getIsFree());
        }
        video2Update.setEpisode(request.getEpisode());
        if (request.getThumbnail()!=null) {
            video2Update.setThumbnail(request.getThumbnail());
        }
        videoRepository.save(video2Update);

        //find film and update film
        Film film = video2Update.getFilm();
        film.setUpdatedAt(LocalDateTime.now());
        if (film.getStatus()) {
            film.setPublishedAt(LocalDateTime.now());
        }
        filmRepository.save(film);
        return VideoPublic.of(video2Update);
    }

    //admin task: delete video
    @Transactional
    public void deleteVideo(Integer videoId) {
        //check video is viewed
        Optional<WatchedVideo> watchedVideo = watchedVideoRepository.findByVideo_Id(videoId);
        if (watchedVideo.isPresent()){
            throw new BadRequestException("Video id " + videoId + " is now in user watched list. Cannot delete");
        }
        //find video
        Video video = videoRepository.findById(videoId)
                        .orElseThrow(()-> {throw new NotFoundException("Video id " + videoId + " not found");});

        //remove video from film and sync with database
        video.setFilm(null);
        entityManager.flush();

        //remove video from persist context & clear context
        entityManager.remove(video);
        entityManager.clear();

        //delete in database
        videoRepository.delete(video);
    }
}
