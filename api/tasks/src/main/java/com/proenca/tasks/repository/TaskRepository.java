package com.proenca.tasks.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

import com.proenca.tasks.entity.Task;
import com.proenca.tasks.entity.UserAccount;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>{
    List<Task> findByUser(UserAccount user);

    Optional<Task> findByIdAndUser(Long id, UserAccount user);
}
