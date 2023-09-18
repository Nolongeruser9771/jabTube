package com.example.japtube.modal;

import lombok.*;
import org.springframework.http.HttpStatus;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ResponseObject {
    private HttpStatus status;
    private String data;
}
