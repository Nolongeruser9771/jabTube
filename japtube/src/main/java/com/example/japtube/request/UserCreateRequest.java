package com.example.japtube.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCreateRequest {
    private String email;
    private String username;
    private String password;
    private String passwordConfirm;
    private String verifyToken;
}
