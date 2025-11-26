package com.appdevg5.powerpuff.citucare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.appdevg5.powerpuff.citucare.entity.Message;
import com.appdevg5.powerpuff.citucare.entity.Session;
import com.appdevg5.powerpuff.citucare.service.MessageService;
import com.appdevg5.powerpuff.citucare.service.SessionService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SessionService sessionService;

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> payload) {
        String messageText = (String) payload.get("message");
        Long sessionId = payload.get("sessionId") == null ? null : ((Number) payload.get("sessionId")).longValue();

        Session session;
        if (sessionId == null) {
            session = sessionService.createSession();
        } else {
            session = sessionService.touchSession(sessionId);
            if (session == null) {
                session = sessionService.createSession();
            }
        }

        Message userMsg = new Message(session, messageText, null, LocalDateTime.now(), null);
        messageService.save(userMsg);

        String botReply = "Echo: " + messageText;
        Message botMsg = new Message(session, null, botReply, LocalDateTime.now(), null);
        messageService.save(botMsg);

        Map<String, Object> resp = new HashMap<>();
        resp.put("sessionId", session.getSessionId());
        resp.put("reply", botReply);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/history")
    public List<Message> history(@RequestParam(required = false) Long sessionId) {
        if (sessionId != null) return messageService.findBySessionId(sessionId);
        return messageService.findAll();
    }
}
