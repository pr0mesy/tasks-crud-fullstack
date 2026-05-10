package com.proenca.tasks.dtos.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record TaskRequestDTO(
    @NotBlank(message = "Title is required.") 
    @Size(max = 150, message = "Title too long.")
    String title,

    @NotBlank(message = "Description is required.")  
    @Size(max = 1000, message = "Description too long.")
    String description,

    @NotBlank(message = "Status is required.") 
    @Pattern(regexp = "pendente|em_progresso|concluida", message = "Invalid status.")
    String status,

    @NotBlank(message = "Priority is required.") 
    @Pattern(regexp = "baixa|media|alta", message = "Invalid priority.")
    String priority
) { }
