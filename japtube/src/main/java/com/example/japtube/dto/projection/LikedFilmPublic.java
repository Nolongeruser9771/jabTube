package com.example.japtube.dto.projection;

import com.example.japtube.entity.LikedFilm;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

public interface LikedFilmPublic {
    Integer getId();

    FilmPublic getFilm();

    LocalDateTime getLikedAt();

    @RequiredArgsConstructor
    class LikedFilmPublicImpl implements LikedFilmPublic {
        private final LikedFilm likedFilm;

        @Override
        public Integer getId() {
            return this.likedFilm.getId();
        }

        @Override
        public FilmPublic getFilm() {
            return FilmPublic.of(this.likedFilm.getFilm());
        }

        @Override
        public LocalDateTime getLikedAt() {
            return this.likedFilm.getLikedAt();
        }
    }
    static LikedFilmPublic of(LikedFilm likedFilm) {
        return new LikedFilmPublicImpl(likedFilm);
    }
}
