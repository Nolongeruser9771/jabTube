package com.example.japtube.dto.projection;

import com.example.japtube.entity.WatchedVideo;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

public interface WatchedVideoPublic {
    Integer getId();

    VideoPublic getVideo();

    LocalDateTime getWatchedAt();

    @RequiredArgsConstructor
    class WatchedVideoPublicImpl implements WatchedVideoPublic {
        private final WatchedVideo watchedVideo;

        @Override
        public Integer getId() {
            return this.watchedVideo.getId();
        }

        @Override
        public VideoPublic getVideo() {
            return VideoPublic.of(this.watchedVideo.getVideo());
        }

        @Override
        public LocalDateTime getWatchedAt() {
            return this.watchedVideo.getWatchedAt();
        }
    }
    static WatchedVideoPublic of(WatchedVideo watchedVideo) {
        return new WatchedVideoPublicImpl(watchedVideo);
    }
}

