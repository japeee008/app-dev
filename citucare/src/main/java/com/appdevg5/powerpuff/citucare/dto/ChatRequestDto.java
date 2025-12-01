package com.appdevg5.powerpuff.citucare.dto;

public class ChatRequestDto {

    // If null or missing => new session will be created
    private Long sessionId;
    private String message;

    public ChatRequestDto() {
        super();
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
