// --- file: src/main/java/com/appdevg5/powerpuff/citucare/config/GlobalExceptionHandler.java ---
package com.appdevg5.powerpuff.citucare.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
  private final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(Exception.class)
  public ResponseEntity<?> handleAll(Exception ex) {
    log.error("Unhandled exception:", ex);
    return ResponseEntity.status(500).body(Map.of(
      "ok", false,
      "error", ex.getMessage() != null ? ex.getMessage() : "Internal server error"
    ));
  }
}
