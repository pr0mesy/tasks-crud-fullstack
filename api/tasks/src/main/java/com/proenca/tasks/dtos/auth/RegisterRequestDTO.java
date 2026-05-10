package com.proenca.tasks.dtos.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequestDTO(
    @NotBlank(message = "E-mail cannot be empty.") 
    @Email(message = "Invalid e-mail.")
    String email,

    @NotBlank(message = "Password cannot be empty.") 
    @Size(min = 6, message = "Password must have at least 6 characters.")
    String pass
) { }
