package com.example.japtube.controller.webController;

import com.example.japtube.dto.projection.CategoryPublic;
import com.example.japtube.dto.projection.CategoryWebPublic;
import com.example.japtube.entity.Category;
import com.example.japtube.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@AllArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    //1. GET: get all category
    @GetMapping("")
    public ResponseEntity<?> getAllCategory(){
        List<CategoryWebPublic> categories = categoryService.getAllCategories();
        return ResponseEntity.ok().body(categories);
    }

    //2. GET: get 5 most popular category
    @GetMapping("/top-categories")
    public ResponseEntity<?> getTop5Categories(){
        List<CategoryWebPublic> categories = categoryService.getMostUsedCategories();
        return ResponseEntity.ok().body(categories);
    }

    //3. GET: get category list by film id
    @GetMapping("/get-categories")
    public ResponseEntity<?> getCategoryByFilmId(@RequestParam Integer filmId){
        List<CategoryPublic> categories = categoryService.getCategoryByFilmId(filmId);
        return ResponseEntity.ok().body(categories);
    }

}
