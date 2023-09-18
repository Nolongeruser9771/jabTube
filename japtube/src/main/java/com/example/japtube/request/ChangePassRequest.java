package com.example.japtube.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangePassRequest {
    private String email;
    private String password;
    private String confirmPassword;
}
