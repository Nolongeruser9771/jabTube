package com.example.japtube.dto.projection;

import com.example.japtube.entity.Film;
import com.example.japtube.entity.Video;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

public interface FilmPublic {
    Integer getId();

    String getTitle();

    Integer getTotalEpisode();

    String getDescription();

    String getThumbnail();

    LocalDateTime getCreatedAt();

    LocalDateTime getUpdatedAt();

    Boolean getStatus();

    Integer getLikes();

    String getLevel();

    LocalDateTime getPublishedAt();

    List<CategoryPublic> getCategoryPublics();

    List<VideoPublic> getVideoPublics();

    Integer getTotalViews();

    @RequiredArgsConstructor
    class FilmPublicImpl implements FilmPublic {
        private final Film film;

        @Override
        public Integer getId() {
            return this.film.getId();
        }

        @Override
        public String getTitle() {
            return this.film.getTitle();
        }

        @Override
        public Integer getTotalEpisode() {
            return this.film.getTotalEpisode();
        }

        @Override
        public String getDescription() {
            return this.film.getDescription();
        }

        @Override
        public String getThumbnail() {
            return this.film.getThumbnail();
        }

        @Override
        public LocalDateTime getCreatedAt() {
            return this.film.getCreatedAt();
        }

        @Override
        public LocalDateTime getUpdatedAt() {
            return this.film.getUpdatedAt();
        }

        @Override
        public Boolean getStatus() {
            return this.film.getStatus();
        }

        @Override
        public Integer getLikes() {
            return this.film.getLikes();
        }

        @Override
        public String getLevel() {
            return this.film.getLevel();
        }

        @Override
        public LocalDateTime getPublishedAt() {
            return film.getPublishedAt();
        }

        @Override
        public List<CategoryPublic> getCategoryPublics() {
            return this.film.getCategories().stream()
                    .map(CategoryPublic::of)
                    .toList();
        }

        @Override
        public List<VideoPublic> getVideoPublics() {
            return this.film.getVideos().stream()
                    .map(VideoPublic::of)
                    .sorted(Comparator.comparingInt(VideoPublic::getEpisode))
                    .toList();
        }

        @Override
        public Integer getTotalViews() {
            int totalViews = 0;
            if (film.getVideos().size() == 0) return 0;

            List<Video> videos = this.film.getVideos();
            for (int i = 0; i < videos.size(); i++) {
                if (videos. get(i).getStatus()) {
                    totalViews += videos.get(i).getViews();
                }
            }
            return totalViews;
        }
    }
    static FilmPublic of(Film film) {
        return new FilmPublicImpl(film);
    }
}
