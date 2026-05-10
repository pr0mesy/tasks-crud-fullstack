package com.proenca.tasks.controller;

import com.proenca.tasks.dtos.account.AccountResponseDTO;
import com.proenca.tasks.dtos.account.UpdateAccountRequestDTO;
import com.proenca.tasks.dtos.account.UpdatePasswordRequestDTO;
import com.proenca.tasks.service.UserAccountService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class UserAccountController {

    private final UserAccountService userAccountService;

    @GetMapping("/me")
    public ResponseEntity<AccountResponseDTO> getCurrentAccount() {
        return ResponseEntity.status(HttpStatus.OK).body(userAccountService.getCurrentAccount());
    }

    @PutMapping("/me")
    public ResponseEntity<AccountResponseDTO> updateAccount(@Valid @RequestBody UpdateAccountRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.OK).body(userAccountService.updateAccount(dto));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> updatePassword(@Valid @RequestBody UpdatePasswordRequestDTO dto) {
        userAccountService.updatePassword(dto);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}