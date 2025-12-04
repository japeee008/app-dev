package com.appdevg5.powerpuff.citucare.service;

import com.appdevg5.powerpuff.citucare.dto.AdminLoginRequestDto;
import com.appdevg5.powerpuff.citucare.dto.AdminLoginResponseDto;
import com.appdevg5.powerpuff.citucare.entity.Department;
import com.appdevg5.powerpuff.citucare.entity.User;
import com.appdevg5.powerpuff.citucare.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public AdminLoginResponseDto loginAdmin(AdminLoginRequestDto request) {

        if (request.getEmail() == null || request.getPassword() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Email and password are required"
            );
        }

        User user = userRepository
                .findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() ->
                        new ResponseStatusException(
                            HttpStatus.UNAUTHORIZED,
                            "Invalid email or password"
                        ));

        // Check password
        if (!user.getPassword().equals(request.getPassword())) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password"
            );
        }

        // Check ADMIN privilege
        if (!Boolean.TRUE.equals(user.getIsAdmin())
            || !"ADMIN".equalsIgnoreCase(user.getRole()))
        {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "User is not authorized as Admin"
            );
        }

        // ✅ Map User → DTO
        AdminLoginResponseDto dto = new AdminLoginResponseDto();

        dto.setUserId(user.getUserId());
        dto.setFname(user.getFname());
        dto.setLname(user.getLname());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());

        Department dept = user.getDepartment();
        if (dept != null) {
            dto.setDepartmentId(dept.getDepartmentId());
            dto.setDepartmentName(dept.getDeptName());
        }

        return dto;
    }
}
