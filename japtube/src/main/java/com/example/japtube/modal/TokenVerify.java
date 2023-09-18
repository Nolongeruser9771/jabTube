package com.example.japtube.modal;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Component
@Getter
@Setter
@Entity
@Table(name = "token_verify")
public class TokenVerify {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "token")
    private String token;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @Column(name = "expiredAt")
    private LocalDateTime expiredAt;

    @Column(name = "verifiedAt")
    private LocalDateTime verifiedAt;

}
