package com.proenca.tasks.dtos.account;

public record AccountResponseDTO(
    Long id,
    String email,
    String role
) { }
