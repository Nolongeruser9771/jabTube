package com.example.japtube.entity;

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
@Table(name = "film")
public class Film {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "title")
    private String title;

    @Column(name = "total_episode")
    private Integer totalEpisode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "published_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime publishedAt;

    @Column(name = "level")
    private String level;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "likes")
    private Integer likes;

    @ManyToMany
    @JoinTable(name = "film_categories",
            joinColumns = @JoinColumn(name = "film_id"),
            inverseJoinColumns = @JoinColumn(name = "categories_id"))
    private List<Category> categories = new ArrayList<>();

    //video associated with film should be deleted when film deleted
    @OneToMany(mappedBy = "film", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Video> videos = new ArrayList<>();

    @PrePersist
    public void prePersist(){
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }
}