package com.appdevg5.powerpuff.citucare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.appdevg5.powerpuff.citucare.entity.Category;
import com.appdevg5.powerpuff.citucare.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
// REMOVED: @PreAuthorize at class level - this was blocking public endpoint
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public Category addCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/public")
    // NO @PreAuthorize here - this makes it public
       public ResponseEntity<?> getPublicCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public Category updateCategory(@PathVariable Long id, @RequestBody Category category) {
        Category existing = categoryService.getCategoryById(id);
        if (existing == null) return null;
        existing.setCategoryName(category.getCategoryName());
        existing.setDescription(category.getDescription());
        existing.setUpdatedAt(java.time.LocalDateTime.now());
        return categoryService.saveCategory(existing);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteById(id);
    }
}