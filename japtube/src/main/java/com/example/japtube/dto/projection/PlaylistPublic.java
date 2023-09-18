package com.example.japtube.dto.projection;

import com.example.japtube.entity.Playlist;
import lombok.RequiredArgsConstructor;

import java.util.List;

public interface PlaylistPublic {
    Integer getId();

    String getName();

    List<ShortsPublic> getShorts();

    Integer getUserId();

    @RequiredArgsConstructor
    class PlaylistPublicImpl implements PlaylistPublic {
        private final Playlist playlist;

        @Override
        public Integer getId() {
            return this.playlist.getId();
        }

        @Override
        public String getName() {
            return this.playlist.getName();
        }

        @Override
        public List<ShortsPublic> getShorts() {
            return this.playlist.getShorts()
                    .stream()
                    .map(ShortsPublic::of)
                    .toList();
        }

        @Override
        public Integer getUserId() {
            return this.playlist.getUser().getId();
        }
    }
    static PlaylistPublic of(Playlist playlist) {return new PlaylistPublicImpl(playlist);}
}
