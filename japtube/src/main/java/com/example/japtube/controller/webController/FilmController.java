package com.example.japtube.controller.webController;

import com.example.japtube.dto.projection.FilmPublic;
import com.example.japtube.dto.projection.LikedFilmPublic;
import com.example.japtube.request.FilmsInCategoryIdsRequest;
import com.example.japtube.service.FilmService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/films")
@AllArgsConstructor
public class FilmController {
    private final FilmService filmService;

    //1. GET: Get all films
    @GetMapping("")
    public ResponseEntity<?> getAllFilms() {
        List<FilmPublic> filmList = filmService.getAllPublicFilm();
        return ResponseEntity.ok().body(filmList);
    }

    //2. GET: get film by id
    @GetMapping("/{filmId}")
    public ResponseEntity<?> getFilmById(@PathVariable Integer filmId) {
        FilmPublic film = filmService.getFilmPublicById(filmId);
        return ResponseEntity.ok().body(film);
    }

    //3. GET: search film by name contains
    @GetMapping(value = "/search")
    public ResponseEntity<?> searchFilms(@RequestParam("searchValue") String filmTitle) {
        List<FilmPublic> filmList =  filmService.getFilmByNameContains(filmTitle);
        return ResponseEntity.ok().body(filmList);
    }

    //4. POST: add to favorite film
    @PostMapping("/{filmId}")
    public ResponseEntity<?> likeFilm(@PathVariable Integer filmId,
                                      @RequestParam Integer userId){
        FilmPublic film = filmService.likeFilm(filmId, userId);
        return ResponseEntity.ok().body(film);
    }

    //5. DELETE: remove from favorite list
    @DeleteMapping("/{filmId}")
    public ResponseEntity<?> UnlikedFilm(@PathVariable Integer filmId,
                                         @RequestParam Integer userId){
        filmService.unlikedFilm(filmId, userId);
        return ResponseEntity.ok().body("Removed from your favorite list");
    }

    //6.GET: get favorite list
    @GetMapping("/favorite-list/{userId}")
    public ResponseEntity<?> getAllLikedFilms(@PathVariable Integer userId){
        List<LikedFilmPublic> favoriteList = filmService.getAllLikedFilms(userId);
        return ResponseEntity.ok().body(favoriteList);
    }

    //7. GET: get all films order by views_Desc
    @GetMapping("/most-view-films")
    public ResponseEntity<?> getAllFilmOrderByViews(){
        List<FilmPublic> films = filmService.getAllFilmOrderByViews();
        return ResponseEntity.ok().body(films);
    }

    //8. GET: top-5 most views each category
    @GetMapping("/most-view-by-category")
    public ResponseEntity<?> getTop5MostViewOfCategory(@RequestParam("categoryId") Integer categoryId){
        List<FilmPublic> films = filmService.getTop5MostViewOfCategory(categoryId);
        return ResponseEntity.ok().body(films);
    }

    //9. GET: Get film by level
    //TODO: Get films by level
    @GetMapping("/level")
    public ResponseEntity<?> getFilmsByLevel(@RequestParam("level") String level){
        List<FilmPublic> films = filmService.getFilmsByLevel(level);
        return ResponseEntity.ok().body(films);
    }

    //10. GET: Get film in categoryIds
    @PostMapping("/categoryIds")
    public ResponseEntity<?> getFilmsInCategoryIds(@RequestBody FilmsInCategoryIdsRequest request, @RequestParam Integer filmId){
        List<FilmPublic> filmList = filmService.getFilmsInCategories(request, filmId);
        return ResponseEntity.ok().body(filmList);
    }
}
