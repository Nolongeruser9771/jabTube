package com.example.japtube.modal;

import com.example.japtube.entity.User;
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
@Table(name = "token_confirm")
public class TokenConfirm {
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

    @Column(name = "confirmedAt")
    private LocalDateTime confirmedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
