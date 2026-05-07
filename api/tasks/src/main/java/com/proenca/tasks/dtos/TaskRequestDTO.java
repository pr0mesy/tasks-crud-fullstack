package com.proenca.tasks.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record TaskRequestDTO(
    @NotEmpty(message = "Title is required.") 
    @Size(max = 150, message = "Title too long")
    String title,

    @NotEmpty(message = "Description is required.")  
    @Size(max = 1000, message = "Description too long")
    String description,

    @NotEmpty(message = "Status is required.") 
    String status,

    @NotEmpty(message = "Priority is required.") 
    String priority
) { }
