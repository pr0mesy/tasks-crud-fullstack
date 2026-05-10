package com.proenca.tasks.dtos.account;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdatePasswordRequestDTO(
    @NotBlank(message = "Current password field is required.") 
    String currentPassword,

    @NotBlank(message = "New password field is required.") 
    @Size(min = 6, message = "New password must have at least 6 characters.")
    String newPassword
    
) { }
