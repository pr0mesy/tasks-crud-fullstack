package com.proenca.tasks.dtos.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskRequestDTO(
    @NotBlank(message = "Title is required.") 
    @Size(max = 150, message = "Title too long.")
    String title,

    @NotBlank(message = "Description is required.")  
    @Size(max = 1000, message = "Description too long.")
    String description,

    @NotBlank(message = "Status is required.") 
    String status,

    @NotBlank(message = "Priority is required.") 
    String priority
) { }
