package com.proenca.tasks.dtos.auth;

import jakarta.validation.constraints.NotEmpty;

public record RegisterRequestDTO(
    @NotEmpty(message = "E-mail cannot be empty") String email,
    @NotEmpty(message = "Password cannot be empty") String pass
) { }
