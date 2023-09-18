package com.example.japtube.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "UserImage")
public class UserImage {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "type")
    private String type;

    @Lob
    @Column(name = "data", columnDefinition = "LONGBLOB")
    private byte[] data;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User user;

}
