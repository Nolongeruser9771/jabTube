package com.example.japtube.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "shorts")
public class Shorts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "title")
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "path")
    private String path;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JoinTable(name = "shorts_playlists",
            joinColumns = @JoinColumn(name = "shorts_id"),
            inverseJoinColumns = @JoinColumn(name = "playlists_id"))
    private Set<Playlist> playlists = new HashSet<>();

    @OneToMany(mappedBy = "shorts", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Note> notes = new HashSet<>();

    @PrePersist
    public void prePersist(){
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate(){
        updatedAt = LocalDateTime.now();
    }
}