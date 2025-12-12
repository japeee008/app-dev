// --- file: src/main/java/com/appdevg5/powerpuff/citucare/controller/AuthController.java ---
package com.appdevg5.powerpuff.citucare.controller;

import com.appdevg5.powerpuff.citucare.dto.AdminLoginRequestDto;
import com.appdevg5.powerpuff.citucare.dto.AdminLoginResponseDto;
import com.appdevg5.powerpuff.citucare.entity.User;
import com.appdevg5.powerpuff.citucare.service.AuthService;
import com.appdevg5.powerpuff.citucare.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(
            @RequestBody AdminLoginRequestDto request,
            HttpSession session) {

        try {
            AdminLoginResponseDto response = authService.loginAdmin(request);

            // store minimal session attribute: userId
            try {
                session.setAttribute("userId", response.getUserId());
                // NOTE: no Spring-Session/Redis indexing here — purely servlet HttpSession
            } catch (Exception e) {
                log.error("Failed to set session attributes", e);
            }

            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            log.error("Exception in loginAdmin", ex);
            Map<String, Object> body = new HashMap<>();
            body.put("ok", false);
            body.put("error", ex.getMessage() != null ? ex.getMessage() : "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        try {
            session.invalidate();
        } catch (Exception e) {
            log.warn("Session invalidate warning", e);
        }
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        try {
            Object maybeId = session.getAttribute("userId");
            if (maybeId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("ok", false, "user", null));
            }

            Long userId;
            if (maybeId instanceof Number) {
                userId = ((Number) maybeId).longValue();
            } else {
                userId = Long.parseLong(String.valueOf(maybeId));
            }

            User user = userService.findById(userId);
            if (user == null) {
                try { session.invalidate(); } catch (Exception ignored) {}
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("ok", false, "user", null));
            }

            AdminLoginResponseDto dto = new AdminLoginResponseDto();
            dto.setUserId(user.getUserId());
            dto.setFname(user.getFname());
            dto.setLname(user.getLname());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole());
            if (user.getDepartment() != null) {
                dto.setDepartmentId(user.getDepartment().getDepartmentId());
                dto.setDepartmentName(user.getDepartment().getDeptName());
            }

            return ResponseEntity.ok(Map.of("ok", true, "user", dto));
        } catch (Exception ex) {
            log.error("Exception in /me", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("ok", false, "error", ex.getMessage()));
        }
    }
}
