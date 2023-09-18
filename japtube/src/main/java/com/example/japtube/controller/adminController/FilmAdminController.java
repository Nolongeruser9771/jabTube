package com.example.japtube.controller.adminController;

import com.example.japtube.dto.projection.FilmPublic;
import com.example.japtube.modal.ResponseObject;
import com.example.japtube.request.FilmCreateRequest;
import com.example.japtube.request.FilmUpsertRequest;
import com.example.japtube.service.FilmService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/admin/films")
@AllArgsConstructor
public class FilmAdminController {
    @Autowired
    private FilmService filmService;

    //1. POST: Create film
    @PostMapping("/create")
    public ResponseEntity<?> createFilm(@RequestBody @Valid FilmCreateRequest request){
        FilmPublic newFilm = filmService.createFilm(request);
        return ResponseEntity.ok().body(newFilm);
    }

    //2. GET: Get all films
    @GetMapping("")
    public ResponseEntity<?> getAllFilms(){
        List<FilmPublic> films = filmService.getAllFilm();
        return ResponseEntity.ok().body(films);
    }

    //3. GET: Get film by id
    @GetMapping("/{filmId}")
    public ResponseEntity<?> getFilmById(@PathVariable Integer filmId){
        FilmPublic film = filmService.getFilmById(filmId);
        return ResponseEntity.ok().body(film);
    }

    //4. PUT: update film
    @PutMapping("")
    public ResponseEntity<?> updateFilm(@RequestParam Integer filmId, @RequestBody FilmUpsertRequest request){
        FilmPublic film = filmService.updateFilm(request, filmId);
        return ResponseEntity.ok().body(film);
    }

    //5. DELETE: delete film
    @DeleteMapping("")
    public ResponseEntity<?> deleteFim(@RequestParam Integer filmId){
        filmService.deleteFilm(filmId);
        return ResponseEntity.ok().body(new ResponseObject(HttpStatus.OK, "Successfully deleted!"));
    }
}
