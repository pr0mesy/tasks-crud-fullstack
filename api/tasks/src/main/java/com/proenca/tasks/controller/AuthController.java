package com.proenca.tasks.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proenca.tasks.dtos.auth.AuthResponseDTO;
import com.proenca.tasks.dtos.auth.LoginRequestDTO;
import com.proenca.tasks.dtos.auth.RegisterRequestDTO;
import com.proenca.tasks.entity.User;
import com.proenca.tasks.repository.UserRepository;
import com.proenca.tasks.security.JwtService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/register")
    public AuthResponseDTO register(@RequestBody RegisterRequestDTO request) {
        User user = User.builder()
                .email(request.email())
                .pass(passwordEncoder.encode(request.pass()))
                .role("ROLE_USER")
                .build();

        usuarioRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponseDTO(token);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.pass()
                )
        );

        String token = jwtService.generateToken(request.email());

        return new AuthResponseDTO(token);
    }
}
