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
public class PlaylistCreateRequest {
    @NotNull
    @NotEmpty
    private String name;
    @NotNull
    private Integer userId;
}
