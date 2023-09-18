package com.example.japtube.security;

import com.example.japtube.entity.User;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.modal.TokenConfirm;
import com.example.japtube.modal.TokenVerify;
import com.example.japtube.repository.TokenConfirmRepository;
import com.example.japtube.repository.TokenVerifyRepository;
import com.example.japtube.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@Slf4j
public class UUIDTokenUtils {
    @Autowired
    private TokenConfirm tokenConfirm;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenConfirmRepository tokenConfirmRepository;

    @Autowired
    private TokenVerifyRepository tokenVerifyRepository;

    //generate token
    public TokenConfirm generateToken(String email){
        //Kiểm tra email có tồn tại trong database ko
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    throw new NotFoundException("Not found user email " + email);
                });
        //Nếu email đã có trong db, tạo ra token -> lưu vào db
        //Token là chuỗi id generate ngẫu nhiên UUID
        TokenConfirm token = TokenConfirm.builder().
                token(UUID.randomUUID().toString())
                .createdAt(LocalDateTime.now())
                .expiredAt(LocalDateTime.now().plusMinutes(10))
                .user(user)
                .build();

        tokenConfirmRepository.save(token);
        return token;
    }

    //generate verify token
    public TokenVerify generateAccountVerifyToken(){
        //Token là chuỗi id generate ngẫu nhiên UUID
        TokenVerify tokenVerify =  TokenVerify.builder().
                token(UUID.randomUUID().toString())
                .createdAt(LocalDateTime.now())
                .expiredAt(LocalDateTime.now().plusMinutes(10))
                .build();

        tokenVerifyRepository.save(tokenVerify);
        return tokenVerify;
    }

    //validate token
    public TokenConfirm validateToken(String token){
        //find token
        TokenConfirm tokenConfirm = tokenConfirmRepository.findByToken(token)
                .orElseThrow(()->{throw new NotFoundException("Invalid Token");});

        //check if token expired
        boolean isExpired = LocalDateTime.now().compareTo(tokenConfirm.getExpiredAt()) > 0;
        log.info("isExpired Token: {}", isExpired);
        if (isExpired) {
            throw new NotFoundException("Expired Token");
        }
        return tokenConfirm;
    }

    //validate verify token
    public TokenVerify validateAccountVerifyToken(String token){
        //find token
        TokenVerify tokenVerify = tokenVerifyRepository.findByToken(token)
                .orElseThrow(()->{throw new NotFoundException("Invalid Verifying Token");});

        //check if token expired
        boolean isExpired = LocalDateTime.now().compareTo(tokenVerify.getExpiredAt()) > 0;
        log.info("isExpired Token: {}", isExpired);
        if (isExpired) {
            throw new NotFoundException("Expired Token");
        }
        return tokenVerify;
    }
}
