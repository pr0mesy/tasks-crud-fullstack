package com.proenca.tasks.dtos.account;

import jakarta.validation.constraints.NotBlank;

public record UpdatePasswordRequestDTO(
    @NotBlank(message = "Current password field is required.") 
    String currentPassword,

    @NotBlank(message = "New password field is required.") 
    String newPassword
    
) { }
