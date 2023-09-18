package com.example.japtube.controller.adminController;

import com.example.japtube.dto.projection.CategoryWebPublic;
import com.example.japtube.modal.ResponseObject;
import com.example.japtube.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/admin/categories")
@AllArgsConstructor
public class CategoryAdminController {
    private CategoryService categoryService;

    //1. POST: create category
    @PostMapping("")
    public ResponseEntity<?> createCategory(@RequestParam String name){
        CategoryWebPublic newCategory = categoryService.createCategory(name);
        return ResponseEntity.ok().body(newCategory);
    }

    //2. DELETE: delete category
    @DeleteMapping("")
    public ResponseEntity<?> deleteCategory(@RequestParam Integer categoryId){
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok().body(new ResponseObject(HttpStatus.OK, "Success"));
    }

    //3. PUT: Update category
    @PutMapping("")
    public ResponseEntity<?> updateCategory(@RequestParam Integer categoryId, @RequestParam String name){
        CategoryWebPublic updatedCategory = categoryService.updateCategory(categoryId, name);
        return ResponseEntity.ok().body(updatedCategory);
    }
}
