package com.appdevg5.powerpuff.citucare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.appdevg5.powerpuff.citucare.entity.Department;
import com.appdevg5.powerpuff.citucare.service.DepartmentService;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService deptService;

    @GetMapping
    public List<Department> all() { return deptService.findAll(); }

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
}
