package com.example.japtube.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "user_package")
public class UserPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "package_id")
    private Packages packages;

    @Column(name = "valid")
    private Boolean valid;

    @Column(name = "effective_date", columnDefinition = "TIMESTAMP")
    private LocalDateTime effectiveDate;

    @Column(name = "expired_at")
    private LocalDateTime expiredAt;

}