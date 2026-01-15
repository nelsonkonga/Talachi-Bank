package com.talachibank.api.controller;

import com.talachibank.api.dto.*;
import com.talachibank.api.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthService authService;

  @PostMapping("/login")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    System.out.println("DEBUG: Login Request Received for user: " + loginRequest.getUsername());
    try {
      JwtResponse response = authService.authenticateUser(
          loginRequest.getUsername(), loginRequest.getPassword());
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("DEBUG: Login Failed: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.badRequest()
          .body(new MessageResponse("❌Error: " + e.getMessage()));
    }
  }

  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    try {
      authService.registerUser(
          signUpRequest.getUsername(),
          signUpRequest.getEmail(),
          signUpRequest.getPassword(),
          signUpRequest.getRoles());

      return ResponseEntity.ok(new MessageResponse(signUpRequest.getUsername() + " registered successfully!!.."));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
    }
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logoutUser() {
    try {
      authService.logoutUser();
      return ResponseEntity.ok(new MessageResponse("🎉 Log out successful!!.."));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("❌ Error: " + e.getMessage()));
    }
  }
}
