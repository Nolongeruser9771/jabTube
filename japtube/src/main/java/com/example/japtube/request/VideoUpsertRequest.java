package com.example.japtube.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class VideoUpsertRequest {
    private String title;
    private Integer episode;
    private String thumbnail;
    private Boolean isFree;
    private Boolean status;
}
