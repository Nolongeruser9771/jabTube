package com.example.japtube.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilmsInCategoryIdsRequest {
    private List<Integer> categoryIds;
}
