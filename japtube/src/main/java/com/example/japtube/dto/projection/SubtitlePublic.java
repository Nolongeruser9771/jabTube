package com.example.japtube.dto.projection;

import com.example.japtube.entity.Subtitle;
import com.example.japtube.entity.Video;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

public interface SubtitlePublic {
    Integer getId();

    String getPath();

    String getLang();

    LocalDateTime getCreatedAt();

    LocalDateTime getUpdatedAt();

    @RequiredArgsConstructor
    class SubtitlePublicImpl implements SubtitlePublic {
        private final Subtitle subtitle;

        @Override
        public Integer getId() {
            return this.subtitle.getId();
        }

        @Override
        public String getPath() {
            return this.subtitle.getPath();
        }

        @Override
        public String getLang() {
            return this.subtitle.getLang();
        }

        @Override
        public LocalDateTime getCreatedAt() {
            return this.subtitle.getCreatedAt();
        }

        @Override
        public LocalDateTime getUpdatedAt() {
            return this.subtitle.getUpdatedAt();
        }

    }
    static SubtitlePublic of(Subtitle subtitle) {
        return new SubtitlePublicImpl(subtitle);
    }
}
