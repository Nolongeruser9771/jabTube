package com.example.japtube.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FilmUpsertRequest {
    private String title;
    @Min(0)
    private Integer totalEpisode;
    private String thumbnail;
    private String description;
    private String level;
    private Boolean status;
    private List<Integer> categoryIdList;
}
