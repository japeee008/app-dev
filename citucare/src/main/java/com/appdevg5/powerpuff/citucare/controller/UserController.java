package com.appdevg5.powerpuff.citucare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.appdevg5.powerpuff.citucare.entity.User;
import com.appdevg5.powerpuff.citucare.entity.Department;
import com.appdevg5.powerpuff.citucare.service.UserService;
import com.appdevg5.powerpuff.citucare.repository.DepartmentRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping
    public List<User> all() { return userService.findAll(); }

    @PostMapping
    public User create(@RequestBody User u) {
        if (u.getDepartment() != null && u.getDepartment().getDepartmentId() != null) {
            Department dept = departmentRepository.findById(u.getDepartment().getDepartmentId()).orElse(null);
            if (dept != null) {
                u.setDepartment(dept);
            }
        }
        return userService.save(u);
    }

    @GetMapping("/{id}")
    public User get(@PathVariable Long id) { return userService.findById(id); }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User u) {
        User existing = userService.findById(id);
        if (existing == null) return null;
        existing.setFname(u.getFname());
        existing.setLname(u.getLname());
        existing.setEmail(u.getEmail());
        existing.setRole(u.getRole());
        existing.setIsAdmin(u.getIsAdmin());
        if (u.getDepartment() != null && u.getDepartment().getDepartmentId() != null) {
            Department dept = departmentRepository.findById(u.getDepartment().getDepartmentId()).orElse(null);
            if (dept != null) {
                existing.setDepartment(dept);
            }
        }
        if (u.getPassword() != null && !u.getPassword().isEmpty()) {
            existing.setPassword(u.getPassword());
        }
        existing.setUpdatedAt(java.time.LocalDateTime.now());
        return userService.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { userService.deleteById(id); }
}
