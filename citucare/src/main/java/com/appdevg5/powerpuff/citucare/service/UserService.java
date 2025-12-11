package com.appdevg5.powerpuff.citucare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import com.appdevg5.powerpuff.citucare.entity.User;
import com.appdevg5.powerpuff.citucare.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User save(User u) {
        LocalDateTime now = LocalDateTime.now();
        if (u.getCreatedAt() == null) u.setCreatedAt(now);
        u.setUpdatedAt(now);
        return userRepository.save(u);
    }

    public List<User> findAll() { return userRepository.findAllWithDepartment(); }

    public List<User> findAllForUser(User currentUser) {
        if ("SUPERADMIN".equals(currentUser.getRole())) {
            return userRepository.findAllWithDepartment();
        } else if ("ADMIN".equals(currentUser.getRole())) {
            return userRepository.findByDepartmentId(currentUser.getDepartment().getDepartmentId());
        } else {
            return List.of(); // No access for other roles
        }
    }

    public User findById(Long id) {
    return userRepository.findById(id).orElse(null);
    }


    public void deleteById(Long id) { userRepository.deleteById(id); }
}
