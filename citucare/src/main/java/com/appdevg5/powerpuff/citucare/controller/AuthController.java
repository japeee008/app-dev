package com.appdevg5.powerpuff.citucare.controller;

import com.appdevg5.powerpuff.citucare.config.JwtUtil;
import com.appdevg5.powerpuff.citucare.dto.AdminLoginRequestDto;
import com.appdevg5.powerpuff.citucare.dto.AdminLoginResponseDto;
import com.appdevg5.powerpuff.citucare.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth") // Update with your desired base path
public class AuthController {

    private final AuthService authService;

    // Constructor injection (recommended)
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AdminLoginResponseDto> loginAdmin(
            @RequestBody AdminLoginRequestDto request) {

        AdminLoginResponseDto response = authService.loginAdmin(request);
        return ResponseEntity.ok(response);
    }
}