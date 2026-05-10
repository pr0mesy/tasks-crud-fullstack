package com.proenca.tasks.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proenca.tasks.dtos.task.TaskRequestDTO;
import com.proenca.tasks.dtos.task.TaskResponseDTO;
import com.proenca.tasks.entity.Task;
import com.proenca.tasks.entity.UserAccount;
import com.proenca.tasks.exceptions.ResourceNotFoundException;
import com.proenca.tasks.mapper.TaskMapper;
import com.proenca.tasks.repository.TaskRepository;
import com.proenca.tasks.repository.UserAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserAccountRepository userAccountRepository;
    private final TaskMapper taskMapper;

    public List<TaskResponseDTO> findAll() {
        UserAccount user = getAuthenticatedUser();

        return taskRepository.findByUser(user)
                .stream()
                .map(taskMapper::toDto)
                .toList();
    }

    public TaskResponseDTO findById(Long id) {
        UserAccount user = getAuthenticatedUser();

        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found."));

        return taskMapper.toDto(task);
    }

    @Transactional
    public TaskResponseDTO create(TaskRequestDTO dto) {
        UserAccount user = getAuthenticatedUser();

        Task task = taskMapper.toEntity(dto);
        task.setUser(user);

        taskRepository.save(task);

        return taskMapper.toDto(task);
    }

    @Transactional
    public void delete(Long id) {
        UserAccount user = getAuthenticatedUser();

        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found."));

        taskRepository.delete(task);
    }

    @Transactional
    public TaskResponseDTO update(Long id, TaskRequestDTO dto) {
        UserAccount user = getAuthenticatedUser();

        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found."));

        taskMapper.updateEntity(task, dto);

        return taskMapper.toDto(task);
    }

    private UserAccount getAuthenticatedUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
    }
}