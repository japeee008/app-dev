package com.appdevg5.powerpuff.citucare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.appdevg5.powerpuff.citucare.entity.User;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailIgnoreCase(String email);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.department")
    List<User> findAllWithDepartment();

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.department WHERE u.department.departmentId = :departmentId")
    List<User> findByDepartmentId(Long departmentId);
}
