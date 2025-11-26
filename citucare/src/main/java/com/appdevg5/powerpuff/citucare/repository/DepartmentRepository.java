package com.appdevg5.powerpuff.citucare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.appdevg5.powerpuff.citucare.entity.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
