package com.example.japtube.utils;

import com.example.japtube.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
@Slf4j
public class FileUtils {
    // Validate file
    public void validateFile(MultipartFile file, List<String> extensions) {
        // Check file name
        String fileName = file.getOriginalFilename();
        if(fileName == null || fileName.isEmpty()) {
            throw new BadRequestException("File name not be null");
        }
        // check extension
        String fileExtension = getFileExtension(fileName);
        log.info(fileExtension);
        if(!checkFileExtension(fileExtension, extensions)) {
            throw new BadRequestException("File not in valid extension");
        }
    }

    // Get file extension
    private String getFileExtension(String fileName) {
        int lastIndexOf = fileName.lastIndexOf(".");
        return fileName.substring(lastIndexOf + 1);
    }

    // Check file if file in valid extension
    private boolean checkFileExtension(String fileExtension, List<String> extensions) {
        return extensions.contains(fileExtension.toLowerCase());
    }
}
