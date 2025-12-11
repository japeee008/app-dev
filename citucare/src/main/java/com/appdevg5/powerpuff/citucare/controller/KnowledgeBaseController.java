package com.appdevg5.powerpuff.citucare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.appdevg5.powerpuff.citucare.entity.KnowledgeBase;
import com.appdevg5.powerpuff.citucare.entity.User;
import com.appdevg5.powerpuff.citucare.service.KnowledgeBaseService;
import com.appdevg5.powerpuff.citucare.dto.KnowledgeBaseDto;
import com.appdevg5.powerpuff.citucare.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/kb")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
public class KnowledgeBaseController {

    @Autowired
    private KnowledgeBaseService kbService;

    @Autowired
    private UserRepository userRepository;  // ← Add this field

    @GetMapping
    public List<KnowledgeBaseDto> all() {
        User currentUser = getCurrentUser();
        return kbService.getAllKnowledgeBaseDtosForUser(currentUser);
    }

    @PostMapping
    public KnowledgeBase create(@RequestBody KnowledgeBase kb) {
        return kbService.save(kb);
    }

    @GetMapping("/{id}")
    public KnowledgeBase get(@PathVariable Long id) {
        return kbService.findById(id);
    }

    @PutMapping("/{id}")
    public KnowledgeBase update(@PathVariable Long id, @RequestBody KnowledgeBase kb) {
        KnowledgeBase existing = kbService.findById(id);
        if (existing == null) return null;
        existing.setTitle(kb.getTitle());
        existing.setQuestionPattern(kb.getQuestionPattern());
        existing.setAnswer(kb.getAnswer());
        existing.setIsPublished(kb.getIsPublished());
        existing.setUpdatedBy(kb.getUpdatedBy());
        existing.setUpdatedAt(java.time.LocalDateTime.now());
        return kbService.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        kbService.deleteById(id);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElse(null);
    }
}