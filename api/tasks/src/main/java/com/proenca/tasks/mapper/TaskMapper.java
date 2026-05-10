package com.proenca.tasks.mapper;

import org.springframework.stereotype.Component;

import com.proenca.tasks.dtos.task.TaskRequestDTO;
import com.proenca.tasks.dtos.task.TaskResponseDTO;
import com.proenca.tasks.entity.Task;

@Component
public class TaskMapper {
    
    public TaskResponseDTO toDto(Task task) {
        return new TaskResponseDTO(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getPriority(),
            task.getCreated_date()
        );
    }

    public Task toEntity(TaskRequestDTO dto) {
        Task task = new Task();

        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setStatus(dto.status());
        task.setPriority(dto.priority());

        return task;
    }

    public void updateEntity(Task task, TaskRequestDTO dto) {
        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setStatus(dto.status());
        task.setPriority(dto.priority());
    }
}
