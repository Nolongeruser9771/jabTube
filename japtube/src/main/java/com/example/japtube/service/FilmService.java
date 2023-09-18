package com.example.japtube.service;

import com.example.japtube.dto.projection.FilmPublic;
import com.example.japtube.dto.projection.LikedFilmPublic;
import com.example.japtube.entity.*;
import com.example.japtube.exception.BadRequestException;
import com.example.japtube.exception.FileHandleException;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.repository.*;
import com.example.japtube.request.FilmCreateRequest;
import com.example.japtube.request.FilmUpsertRequest;
import com.example.japtube.request.FilmsInCategoryIdsRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class FilmService {
    @Autowired
    private FilmRepository filmRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikedFilmRepository likedFilmRepository;

    @Autowired
    private WatchedVideoRepository watchedVideoRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    //get all public films
    public List<FilmPublic> getAllPublicFilm() {
        List<Film> films = filmRepository.findByStatusOrderByPublishedAtDesc(true);
        return films.stream()
                .map(FilmPublic::of)
                .toList();
    }

    //get all films
    public List<FilmPublic> getAllFilm() {
        List<Film> films = filmRepository.findByOrderByPublishedAtDesc();
        return films.stream()
                .map(FilmPublic::of)
                .toList();
    }


    //get film public by id
    public FilmPublic getFilmPublicById(Integer filmId) {
        Film film = filmRepository.findByIdAndStatus(filmId, true).orElseThrow(
                () ->  new NotFoundException("film id "+ filmId +" not found")
        );
        return FilmPublic.of(film);
    }

    //get film by id
    public FilmPublic getFilmById(Integer filmId) {
        Film film = filmRepository.findById(filmId).orElseThrow(
                () ->  new NotFoundException("film id "+ filmId +" not found")
        );
        return FilmPublic.of(film);
    }

    //get film by name contains
    public List<FilmPublic> getFilmByNameContains(String filmTitle) {
        List<Film> films = filmRepository.findByTitleContainsAndStatusOrderByPublishedAtDesc(filmTitle, true);
        return films.stream()
                .map(FilmPublic::of)
                .toList();
    }

    //add to favorite list
    public FilmPublic likeFilm(Integer filmId, Integer userId) {
        //validate userId: is exited?
        User user = findUserById(userId);

        //validate filmId: is existed?
        Film film = findFilmById(filmId);

        //check if user already like this film
        Optional<LikedFilm> likedFilm = likedFilmRepository.findByUser_IdAndFilm_Id(userId,filmId);
        if (likedFilm.isPresent()) {
            throw new BadRequestException("User id " + userId + " already liked film id " + filmId
            + " .You can remove, but cannot add");
        }
        //add to liked_film_repo + update likes
        LikedFilm newLikedFilm = LikedFilm.builder()
                .film(film)
                .user(user)
                .likedAt(LocalDateTime.now())
                .build();

        filmRepository.save(film);
        film.setLikes(film.getLikes() + 1);

        likedFilmRepository.save(newLikedFilm);
        return FilmPublic.of(film);
    }

    private Film findFilmById(Integer filmId) {
        Optional<Film> film = filmRepository.findByIdAndStatus(filmId, true);
        if (film.isEmpty()){
            throw new NotFoundException("Film id "+ filmId + " not found");
        }
        return film.get();
    }

    private User findUserById(Integer userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()){
            throw new NotFoundException("User id "+ userId + " not found");
        }
        return user.get();
    }

    //remove from favorite list
    public void unlikedFilm(Integer filmId, Integer userId) {
        //check if this film existed in likedFilmRepo
        Optional<LikedFilm> film2Find = likedFilmRepository.findByUser_IdAndFilm_Id(userId, filmId);
        if (film2Find.isEmpty()) {
            throw new NotFoundException("User id "+ userId + " hasn't liked film id " + filmId + " yet.");
        }
        likedFilmRepository.delete(film2Find.get());

        //find film, update likes
        Film film2remove = film2Find.get().getFilm();
        film2remove.setLikes(film2remove.getLikes() - 1);
        filmRepository.save(film2remove);
    }

    //get favorite list
    public List<LikedFilmPublic> getAllLikedFilms(Integer userId) {
        List<LikedFilm> likedFilmList = likedFilmRepository.findByUser_IdAndFilm_StatusOrderByLikedAtDesc(userId, true);
        return likedFilmList.stream()
                .map(LikedFilmPublic::of)
                .toList();
    }

    //get all ordered by view
    public List<FilmPublic> getAllFilmOrderByViews(){
        return filmRepository.findByStatus(true)
                .stream()
                .map(FilmPublic::of)
                .sorted((f1,f2) -> (f2.getTotalViews() - f1.getTotalViews()))
                .toList();
    }

    //get top 5 most view films of a category
    public List<FilmPublic> getTop5MostViewOfCategory(Integer categoryId) {
        return filmRepository.findByCategories_IdAndStatus(categoryId, true)
                .stream().map(FilmPublic::of)
                .sorted((f1,f2) -> (f2.getTotalViews() - f1.getTotalViews()))
                .limit(5)
                .toList();
    }

    //get films by level
    public List<FilmPublic> getFilmsByLevel(String level) {
        List<Film> films = filmRepository.findByLevelAndStatusOrderByPublishedAtDesc(level,true);
        return films.stream()
                .map(FilmPublic::of)
                .toList();
    }

    //admin task: create film
    @Transactional
    public FilmPublic createFilm(FilmCreateRequest request) {
        //find list category
        List<Category> categories = categoryRepository.findByIdIn(request.getCategoryIdList());
        //create new Film
        Film film = Film.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .totalEpisode(request.getTotalEpisode())
                    .level(request.getLevel())
                    .thumbnail(request.getThumbnail())
                    .likes(0)
                    .status(request.getStatus())
                    .videos(new ArrayList<>())
                    .categories(categories).build();

            filmRepository.save(film);
            return FilmPublic.of(film);
    }

    //admin task: update film
    @Transactional
    public FilmPublic updateFilm (FilmUpsertRequest request, Integer filmId){
        //find film id
        Film film = filmRepository.findById(filmId)
                .orElseThrow(() -> {throw new NotFoundException("Film id " + filmId + " not found");});

        //find categories
        List<Category> categories =  categoryRepository.findByIdIn(request.getCategoryIdList());

        //update
        film.setDescription(request.getDescription());
        film.setCategories(categories);
        film.setLevel(request.getLevel());
        film.setStatus(request.getStatus());
        film.setThumbnail(request.getThumbnail() == null ? film.getThumbnail() : request.getThumbnail());
        film.setTitle(request.getTitle());
        film.setTotalEpisode(request.getTotalEpisode());
        film.setUpdatedAt(LocalDateTime.now());
        if (request.getStatus()) {
            film.setPublishedAt(LocalDateTime.now());
        }
        filmRepository.save(film);
        return FilmPublic.of(film);
    }

    //delete film
    @Transactional
    public void deleteFilm(Integer filmId){
        //find film id
        Film film = filmRepository.findById(filmId)
                .orElseThrow(() -> {throw new NotFoundException("Film id " + filmId + " not found");});

        //check if film is liked or videos are watched
        List<LikedFilm> likedFilm = likedFilmRepository.findByFilm_Id(filmId);
        if (likedFilm.size() > 0){
            throw new BadRequestException("Film id " + filmId + " is now in favorite list of users. Cannot delete!");
        }

        List<Integer> videoIds = film.getVideos().stream().map(Video::getId).toList();
        List<WatchedVideo> watchedVideos = watchedVideoRepository.findByVideo_IdIn(videoIds);
        if (watchedVideos.size() > 0){
            throw new BadRequestException("Film id " + filmId + " is viewed by users. Cannot delete!");
        }

        filmRepository.delete(film);
    }

    //get films by categoryId List
    public List<FilmPublic> getFilmsInCategories(FilmsInCategoryIdsRequest request, Integer filmId) {
        List<Film> films = filmRepository.findByCategories_IdInAndStatusOrderByPublishedAtDesc(request.getCategoryIds(), true);
        return films.stream()
                .filter(film -> !Objects.equals(film.getId(), filmId))
                .map(FilmPublic::of)
                .toList();
    }
}
