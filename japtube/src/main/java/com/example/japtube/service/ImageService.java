package com.example.japtube.service;

import com.example.japtube.entity.*;
import com.example.japtube.exception.FileHandleException;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.repository.*;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@Slf4j
public class ImageService {
    @Autowired
    private UserImageRepository userImageRepository;

    @Autowired
    private ThumbnailRepository thumbnailRepository;

    @Autowired
    private UserRepository userRepository;

    //Upload user avatar
    @Transactional
    public UserImage uploadUserAvatar(MultipartFile file, Integer userId){
        //find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { throw new NotFoundException("User id " + userId + " not found");});

        log.info("userId : {}", userId);
        //find userImage
        Optional<UserImage> userImage = userImageRepository.findByUser_Id(userId);
        if (userImage.isPresent()) {
            //update
            try {
                UserImage userImage2Update = userImage.get();
                userImage2Update.setType(file.getContentType());
                userImage2Update.setData(file.getBytes());
                userImageRepository.save(userImage2Update);

                return userImage2Update;
            }catch (IOException ex) {
                throw new FileHandleException("Error when update user avatar");
            }
        }
        //Create UserImage & save to repo
        try {
            UserImage newUserImage = UserImage.builder()
                    .type(file.getContentType())
                    .data(file.getBytes())
                    .user(user)
                    .build();
            userImageRepository.save(newUserImage);

            //set avatar for user
            String apiUrl = "/api/v1/images/avatar?imageId=" + newUserImage.getId();
            user.setAvatar(apiUrl);
            userRepository.save(user);
            //return apiUrl to read image
            return newUserImage;
        } catch (IOException ex){
            throw new FileHandleException("Error when loading user avatar");
        }
    }

    //Admin task: Upload film thumbnail
    @Transactional
    public String uploadThumbnail(MultipartFile file){
        try{
            Thumbnail newThumbnail = Thumbnail.builder()
                    .type(file.getContentType())
                    .data(file.getBytes())
                    .build();
            thumbnailRepository.save(newThumbnail);
            String apiUrl = "/api/v1/images/thumbnail?imageId=" + newThumbnail.getId();

            return apiUrl;
        } catch (IOException ex){
            throw new FileHandleException("Error when loading film thumbnail");
        }
    }

    //Read user avatar
    public byte[] getUserAvatarById(Integer imageId){
        UserImage userImage =  userImageRepository.findById(imageId)
                .orElseThrow(()->{throw new NotFoundException("User avatar id "+ imageId +" not found");});
        return userImage.getData();
    }

    //Read thumbnail
    public byte[] getThumbnailById(Integer imageId){
        Thumbnail thumbnail =  thumbnailRepository.findById(imageId)
                .orElseThrow(()->{throw new NotFoundException("Video thumbnail id "+ imageId +" not found");});
        return thumbnail.getData();
    }
}
