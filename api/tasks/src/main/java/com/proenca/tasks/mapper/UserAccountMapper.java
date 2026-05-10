package com.proenca.tasks.mapper;

import org.springframework.stereotype.Component;

import com.proenca.tasks.dtos.account.AccountResponseDTO;
import com.proenca.tasks.entity.UserAccount;

@Component
public class UserAccountMapper {

    public AccountResponseDTO toAccountResponse(UserAccount user) {
        return new AccountResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getRole()
        );
    }
}