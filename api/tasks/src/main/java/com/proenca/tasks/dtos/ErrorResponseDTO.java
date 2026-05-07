package com.proenca.tasks.dtos;

import java.time.LocalDateTime;

public record ErrorResponseDTO(
    int status,
    String title,
    String message,
    String path,
    LocalDateTime timeStamp
) { }
