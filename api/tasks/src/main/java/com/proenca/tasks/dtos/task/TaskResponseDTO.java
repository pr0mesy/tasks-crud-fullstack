package com.proenca.tasks.dtos.task;

import java.time.LocalDateTime;

public record TaskResponseDTO(
    Long id,
    String title,
    String description,
    String status,
    String priority,
    LocalDateTime created_at
) { }
