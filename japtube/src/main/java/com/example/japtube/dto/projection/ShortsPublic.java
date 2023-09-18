package com.example.japtube.dto.projection;

import com.example.japtube.entity.Playlist;
import com.example.japtube.entity.Shorts;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public interface ShortsPublic {
    Integer getId();

    String getTitle();

    String getDescription();

    String getPath();

    LocalDateTime getCreateAt();

    LocalDateTime getUpdatedAt();

    List<Integer> getPlaylistIds();

    @RequiredArgsConstructor
    class ShortsPublicImpl implements ShortsPublic {
        private final Shorts shorts;

        @Override
        public Integer getId() {
            return this.shorts.getId();
        }

        @Override
        public String getTitle() {
            return this.shorts.getTitle();
        }

        @Override
        public String getDescription() {
            return this.shorts.getDescription();
        }

        @Override
        public String getPath() {
            return this.shorts.getPath();
        }

        @Override
        public LocalDateTime getCreateAt() {
            return this.shorts.getCreatedAt();
        }

        @Override
        public LocalDateTime getUpdatedAt() {
            return this.shorts.getUpdatedAt();
        }

        @Override
        public List<Integer> getPlaylistIds() {
            return this.shorts.getPlaylists()
                    .stream()
                    .map(Playlist::getId)
                    .toList();
        }
    }
    static ShortsPublic of(Shorts shorts) {return new ShortsPublicImpl(shorts);}
}
