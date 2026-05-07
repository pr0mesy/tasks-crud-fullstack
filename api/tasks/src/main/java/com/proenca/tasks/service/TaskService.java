package com.proenca.tasks.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proenca.tasks.dtos.TaskRequestDTO;
import com.proenca.tasks.dtos.TaskResponseDTO;
import com.proenca.tasks.entity.Task;
import com.proenca.tasks.exceptions.ResourceNotFoundException;
import com.proenca.tasks.mapper.TaskMapper;
import com.proenca.tasks.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository repository;
    private final TaskMapper mapper;

    public List<TaskResponseDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public TaskResponseDTO findById(Long id) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        return mapper.toDto(task);
    }

    @Transactional
    public TaskResponseDTO create(TaskRequestDTO dto) {
        Task task = mapper.toEntity(dto);

        repository.save(task);

        return mapper.toDto(task);
    }

    @Transactional
    public void delete(Long id) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        repository.delete(task);
    }

    @Transactional
    public TaskResponseDTO update(Long id, TaskRequestDTO dto) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        mapper.updateEntity(task, dto);

        // não precisa chamar o repository, o jpa ja salva pra nois

        return mapper.toDto(task);
    }

}
