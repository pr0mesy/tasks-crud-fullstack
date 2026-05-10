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
import com.proenca.tasks.entity.UserAccount;
import com.proenca.tasks.repository.UserAccountRepository;
import com.proenca.tasks.security.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserAccountRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/register")
    public AuthResponseDTO register(@Valid @RequestBody RegisterRequestDTO dto) {
        UserAccount user = UserAccount.builder()
                .email(dto.email())
                .pass(passwordEncoder.encode(dto.pass()))
                .role("ROLE_USER")
                .build();

        usuarioRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponseDTO(token);
    }


    @PostMapping("/login")
    public AuthResponseDTO login(@Valid @RequestBody LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.email(),
                        dto.pass()
                )
        );

        String token = jwtService.generateToken(dto.email());

        return new AuthResponseDTO(token);
    }
}
