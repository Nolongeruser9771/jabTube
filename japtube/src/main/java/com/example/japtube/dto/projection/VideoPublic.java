package com.example.japtube.dto.projection;

import com.example.japtube.entity.Subtitle;
import com.example.japtube.entity.Video;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

public interface VideoPublic {
    Integer getId();

    String getTittle();

    String getType();

    Integer getEpisode();

    String getThumbnail();

    LocalTime getDuration();

    Long getSize();

    String getPath();

    Integer getFilmId();

    Boolean getIsFree();

    LocalDateTime getCreatedAt();

    LocalDateTime getUpdatedAt();

    LocalDateTime getPublishedAt();

    Boolean getStatus();

    Integer getViews();

    boolean getIsJapSubExist();

    boolean getIsVietSubExist();

    @RequiredArgsConstructor
    class VideoPublicImpl implements VideoPublic {
        private final Video video;

        @Override
        public Integer getId() {
            return this.video.getId();
        }

        @Override
        public String getTittle() {
            return this.video.getTitle();
        }

        @Override
        public String getType() {
            return this.video.getType();
        }

        @Override
        public Integer getEpisode() {
            return this.video.getEpisode();
        }

        @Override
        public String getThumbnail() {
            return this.video.getThumbnail();
        }

        @Override
        public LocalTime getDuration() {
            return this.video.getDuration();
        }

        @Override
        public Long getSize() {
            return this.video.getSize();
        }

        @Override
        public String getPath() {
            return this.video.getPath();
        }

        @Override
        public Integer getFilmId() {
            return this.video.getFilm().getId();
        }

        @Override
        public Boolean getIsFree() {
            return this.video.getIsFree();
        }

        @Override
        public LocalDateTime getCreatedAt() {
            return this.video.getCreatedAt();
        }

        @Override
        public LocalDateTime getUpdatedAt() {
            return this.video.getUpdatedAt();
        }

        @Override
        public LocalDateTime getPublishedAt() {
            return this.video.getPublishedAt();
        }

        @Override
        public Boolean getStatus() {
            return this.video.getStatus();
        }

        @Override
        public Integer getViews() {
            return this.video.getViews();
        }

        @Override
        public boolean getIsJapSubExist() {
            List<Subtitle> subtitles = this.video.getSubtitles();
            for (Subtitle subtitle: subtitles) {
                if (Objects.equals(subtitle.getLang(), "jp")) {
                    return true;
                }
            }
            return false;
        }

        @Override
        public boolean getIsVietSubExist() {
            List<Subtitle> subtitles = this.video.getSubtitles();
            for (Subtitle subtitle: subtitles) {
                if (Objects.equals(subtitle.getLang(), "vi")) {
                    return true;
                }
            }
            return false;
        }

    }
    static VideoPublic of(Video video) {
        return new VideoPublicImpl(video);
    }
}
