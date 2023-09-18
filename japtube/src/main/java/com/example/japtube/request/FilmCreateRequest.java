package com.example.japtube.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FilmCreateRequest {
    @NotEmpty
    @NotNull
    private String title;
    @Min(0)
    private Integer totalEpisode;
    private String thumbnail;
    private String description;
    private String level;
    private Boolean status;
    private List<Integer> categoryIdList;
}
