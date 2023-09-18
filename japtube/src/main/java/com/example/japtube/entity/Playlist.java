package com.example.japtube.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "playlist")
public class Playlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name", length = 100)
    private String name;

    @ManyToMany(mappedBy = "playlists")
    private Set<Shorts> shorts = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}