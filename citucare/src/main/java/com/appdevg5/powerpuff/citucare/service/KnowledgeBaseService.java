package com.appdevg5.powerpuff.citucare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import com.appdevg5.powerpuff.citucare.entity.KnowledgeBase;
import com.appdevg5.powerpuff.citucare.repository.KnowledgeBaseRepository;

@Service
public class KnowledgeBaseService {

    @Autowired
    private KnowledgeBaseRepository kbRepository;

    public KnowledgeBase save(KnowledgeBase kb) {
        LocalDateTime now = LocalDateTime.now();
        if (kb.getCreatedAt() == null) kb.setCreatedAt(now);
        kb.setUpdatedAt(now);
        return kbRepository.save(kb);
    }

    public List<KnowledgeBase> findAll() {
        return kbRepository.findAll();
    }

    public KnowledgeBase findById(Long id) {
        return kbRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        kbRepository.deleteById(id);
    }
}
