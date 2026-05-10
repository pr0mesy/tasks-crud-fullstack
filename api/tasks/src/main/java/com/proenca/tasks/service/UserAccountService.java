package com.proenca.tasks.service;

import com.proenca.tasks.dtos.account.AccountResponseDTO;
import com.proenca.tasks.dtos.account.UpdateAccountRequestDTO;
import com.proenca.tasks.dtos.account.UpdatePasswordRequestDTO;
import com.proenca.tasks.entity.UserAccount;
import com.proenca.tasks.mapper.UserAccountMapper;
import com.proenca.tasks.repository.UserAccountRepository;
import com.proenca.tasks.security.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserAccountService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserAccountMapper userAccountMapper;
    private final JwtService jwtService;

    public AccountResponseDTO getCurrentAccount() {
        UserAccount user = getAuthenticatedUser();

        return userAccountMapper.toAccountResponse(user);
    }

    public AccountResponseDTO updateAccount(UpdateAccountRequestDTO request) {
        UserAccount user = getAuthenticatedUser();

        boolean emailAlreadyExists = userAccountRepository
                .findByEmail(request.email())
                .filter(existingUser -> !existingUser.getId().equals(user.getId()))
                .isPresent();

        if (emailAlreadyExists) {
            throw new IllegalArgumentException("E-mail already in use.");
        }

        user.setEmail(request.email());

        UserAccount updatedUser = userAccountRepository.save(user);
        String token = jwtService.generateToken(updatedUser.getEmail());

        return new AccountResponseDTO(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getRole(),
                token
        );
    }

    public void updatePassword(UpdatePasswordRequestDTO request) {
        UserAccount user = getAuthenticatedUser();

        boolean currentPasswordMatches = passwordEncoder.matches(
                request.currentPassword(),
                user.getPass()
        );

        if (!currentPasswordMatches) {
            throw new IllegalArgumentException("Current password invalid.");
        }

        user.setPass(
                passwordEncoder.encode(request.newPassword())
        );

        userAccountRepository.save(user);
    }

    private UserAccount getAuthenticatedUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userAccountRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User autenticated not found."));
    }
}
