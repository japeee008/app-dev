package com.appdevg5.powerpuff.citucare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.appdevg5.powerpuff.citucare.entity.KnowledgeBase;
import com.appdevg5.powerpuff.citucare.service.KnowledgeBaseService;

@RestController
@RequestMapping("/api/kb")
@CrossOrigin(origins = "http://localhost:3000")
public class KnowledgeBaseController {

    @Autowired
    private KnowledgeBaseService kbService;

    @GetMapping
    public List<KnowledgeBase> all() {
        return kbService.findAll();
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
}
