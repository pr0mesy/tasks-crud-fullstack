package com.proenca.tasks.dtos.auth;

public record RegisterRequestDTO(
    String email,
    String pass
) { }
