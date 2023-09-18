package com.example.japtube.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShortsUpsertRequest {
    private String title;
    private String description;
    @NotNull
    private Integer shortsId;
    private List<Integer> playlistIds;
}
