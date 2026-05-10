package com.proenca.tasks.dtos.account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateAccountRequestDTO(
    @NotBlank(message = "E-mail is required.")
    @Email(message = "Invalid e-mail.")
    String email
) { }
