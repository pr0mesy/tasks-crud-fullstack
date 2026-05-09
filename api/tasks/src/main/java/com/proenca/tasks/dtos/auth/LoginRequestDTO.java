package com.proenca.tasks.dtos.auth;

public record LoginRequestDTO(
    String email,
    String pass
) { }
