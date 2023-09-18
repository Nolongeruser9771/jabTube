package com.example.japtube.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShortsCreateRequest {
    private String title;
    private String description;

    @NotNull
    private Integer userId;

    @NotNull
    private Integer videoId;

    @NotNull
    private double startTime;

    @NotNull
    private double length;
}
