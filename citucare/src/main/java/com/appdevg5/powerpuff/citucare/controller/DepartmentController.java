package com.appdevg5.powerpuff.citucare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.appdevg5.powerpuff.citucare.entity.Department;
import com.appdevg5.powerpuff.citucare.entity.User;  // ← Add this
import com.appdevg5.powerpuff.citucare.service.DepartmentService;
import com.appdevg5.powerpuff.citucare.repository.UserRepository;  // ← Add this
import org.springframework.security.core.Authentication;  // ← Add this
import org.springframework.security.core.context.SecurityContextHolder;  // ← Add this

@RestController
@RequestMapping("/api/departments")
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
public class DepartmentController {

    @Autowired
    private DepartmentService deptService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Department> all() {
        User currentUser = getCurrentUser();
        return deptService.findAllForUser(currentUser);
    }

    @PostMapping
    public Department create(@RequestBody Department d) { return deptService.save(d); }

    @GetMapping("/{id}")
    public Department get(@PathVariable Long id) { return deptService.findById(id); }

    @PutMapping("/{id}")
    public Department update(@PathVariable Long id, @RequestBody Department d) {
        Department existing = deptService.findById(id);
        if (existing == null) return null;
        existing.setDeptName(d.getDeptName());
        existing.setEmail(d.getEmail());
        existing.setUpdatedAt(java.time.LocalDateTime.now());
        return deptService.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { deptService.deleteById(id); }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElse(null);
    }
}