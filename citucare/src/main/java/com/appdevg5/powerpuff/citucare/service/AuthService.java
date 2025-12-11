package com.appdevg5.powerpuff.citucare.service;

import com.appdevg5.powerpuff.citucare.dto.AdminLoginRequestDto;
import com.appdevg5.powerpuff.citucare.dto.AdminLoginResponseDto;
import com.appdevg5.powerpuff.citucare.entity.Department;
import com.appdevg5.powerpuff.citucare.entity.User;
import com.appdevg5.powerpuff.citucare.repository.UserRepository;
import com.appdevg5.powerpuff.citucare.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        System.out.println(
                "DEBUG LOGIN => email=" + user.getEmail()
                        + ", isAdmin=" + user.getIsAdmin()
                        + ", rawRole='" + user.getRole() + "'"
        );

        if (!Boolean.TRUE.equals(user.getIsAdmin())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "User is not authorized as Admin"
            );
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        AdminLoginResponseDto dto = new AdminLoginResponseDto();
        dto.setUserId(user.getUserId());
        dto.setFname(user.getFname());
        dto.setLname(user.getLname());
        dto.setEmail(user.getEmail());
        dto.setToken(token);

        Department dept = user.getDepartment();
        if (dept != null) {
            dto.setDepartmentId(dept.getDepartmentId());
            dto.setDepartmentName(dept.getDeptName());
        }

        return dto;
    }
}
