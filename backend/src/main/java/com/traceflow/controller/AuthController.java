package com.traceflow.controller;

import com.traceflow.dto.AuthResponse;
import com.traceflow.dto.UserDto;
import com.traceflow.model.User;
import com.traceflow.repository.UserRepository;
import com.traceflow.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<UserDto.Response> register(@Valid @RequestBody UserDto.RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserDto.LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new com.traceflow.exception.BadRequestException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new com.traceflow.exception.BadRequestException("Invalid username or password");
        }

        UserDto.Response userResponse = userService.getById(user.getId());

        // Simple token: base64(userId:username:timestamp)
        String token = java.util.Base64.getEncoder()
                .encodeToString((user.getId() + ":" + user.getUsername() + ":" + System.currentTimeMillis()).getBytes());

        return ResponseEntity.ok(AuthResponse.builder()
                .user(userResponse)
                .token(token)
                .build());
    }
}
