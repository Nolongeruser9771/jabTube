package com.example.japtube.service;

import com.example.japtube.dto.projection.CategoryPublic;
import com.example.japtube.dto.projection.CategoryWebPublic;
import com.example.japtube.entity.Category;
import com.example.japtube.exception.BadRequestException;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    //get all category
    public List<CategoryWebPublic> getAllCategories(){
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(CategoryWebPublic::of)
                .toList();
    }

    //get most popular categories
    public List<CategoryWebPublic> getMostUsedCategories(){
        return getAllCategories().stream()
                .sorted((c1,c2) -> c2.getUsed()-c1.getUsed())
                .toList();
    }

    //get categories used in film by film id
    public List<CategoryPublic> getCategoryByFilmId(Integer filmId) {
        List<Category> categories = categoryRepository.findByFilms_Id(filmId);
        return categories.stream()
                .map(CategoryPublic::of)
                .toList();
    }
    //admin task: delete category
    public void deleteCategory(Integer categoryId){
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> {throw new NotFoundException("Category id " + categoryId + " not found");});
        if (CategoryWebPublic.of(category).getUsed() > 0) {
            throw new BadRequestException("Category id " + categoryId + " is applied for films. Cannot delete");
        }
        categoryRepository.delete(category);
    }

    //admin task: updatecategory
    public CategoryWebPublic updateCategory(Integer categoryId, String name){
        //find category
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> {throw new NotFoundException("Category id " + categoryId + " not found");});

        if (categoryRepository.findByNameAllIgnoreCase(name).size() > 0) {
            throw new BadRequestException(name + " is used for other category. Please choose another name to prevent duplicate category");
        }
        category.setName(name);
        categoryRepository.save(category);
        return CategoryWebPublic.of(category);
    }

    //admin task: create Category
    public CategoryWebPublic createCategory(String name) {
        if (categoryRepository.findByNameAllIgnoreCase(name).size() > 0) {
            throw new BadRequestException(name + " is used for other category. Please choose another name to prevent duplicate category");
        }
        Category newCategory =  Category.builder()
                .name(name)
                .films(new ArrayList<>())
                .build();
        categoryRepository.save(newCategory);
        return CategoryWebPublic.of(newCategory);
    }
}
