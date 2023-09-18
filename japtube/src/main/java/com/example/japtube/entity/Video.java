package com.example.japtube.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "video")
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "title")
    private String title;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "episode")
    private Integer episode;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "duration")
    private LocalTime duration;

    @Column(name = "size")
    private Long size;

    @Column(name = "path")
    private String path;

    @Column(name = "is_free")
    private Boolean isFree;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;

    @Column(name = "published_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime publishedAt;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "views")
    private Integer views;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "film_id")
    private Film film;

    //subtitle & comments deleted when video associated with be deleted
    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subtitle> subtitles;

    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    @PrePersist
    public void prePersist(){
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
        if (status) {
            publishedAt = createdAt;
        }
    }

    @PreUpdate
    public void preUpdate(){
        updatedAt = LocalDateTime.now();
        if (status) {
            publishedAt = LocalDateTime.now();
        }
    }
}