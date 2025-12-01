package com.appdevg5.powerpuff.citucare.service;

import com.appdevg5.powerpuff.citucare.dto.KnowledgeBaseDto;
import com.appdevg5.powerpuff.citucare.entity.KnowledgeBase;
import com.appdevg5.powerpuff.citucare.repository.KnowledgeBaseRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KnowledgeBaseService {

    @Autowired
    private KnowledgeBaseRepository kbRepository;

    @Autowired
    private ModelMapper modelMapper;   // like in your slide (UserServiceImpl)

    // ============ ENTITY METHODS (same as before) ============

    public KnowledgeBase save(KnowledgeBase kb) {
        LocalDateTime now = LocalDateTime.now();
        if (kb.getCreatedAt() == null) {
            kb.setCreatedAt(now);
        }
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

    // ============ DTO METHODS (NEW) ============

    public List<KnowledgeBaseDto> getAllKnowledgeBaseDtos() {
        List<KnowledgeBase> list = kbRepository.findAll();

        // Same pattern as: modelMapper.map(user, UserDto.class)
        return list.stream()
                .map(kb -> modelMapper.map(kb, KnowledgeBaseDto.class))
                .collect(Collectors.toList());
    }

    public KnowledgeBaseDto getKnowledgeBaseDtoById(Long id) {
        KnowledgeBase kb = kbRepository.findById(id).orElse(null);
        if (kb == null) {
            return null;
        }
        return modelMapper.map(kb, KnowledgeBaseDto.class);
    }


    public KnowledgeBase findMatchingKnowledgeBase(String userMessage) {
    if (userMessage == null || userMessage.isBlank()) {
        return null;
    }

    String normalized = userMessage.toLowerCase();

    // use your existing repo method
    List<KnowledgeBase> kbList = kbRepository.findByIsPublished(true);

    for (KnowledgeBase kb : kbList) {
        String patterns = kb.getQuestionPattern();
        if (patterns == null || patterns.isBlank()) continue;

        // split by comma or semicolon
        String[] tokens = patterns.toLowerCase().split("[,;]");

        for (String token : tokens) {
            String keyword = token.trim();
            if (keyword.isEmpty()) continue;

            if (normalized.contains(keyword)) {
                // first match wins
                return kb;
            }
        }
    }

    return null; // no match
}
}
