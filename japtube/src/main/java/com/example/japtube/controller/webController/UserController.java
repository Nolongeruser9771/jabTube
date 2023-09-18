package com.example.japtube.controller.webController;

import com.example.japtube.dto.projection.UserPublic;
import com.example.japtube.exception.BadRequestException;
import com.example.japtube.modal.ResponseObject;
import com.example.japtube.modal.TokenConfirm;
import com.example.japtube.modal.TokenVerify;
import com.example.japtube.repository.UserRepository;
import com.example.japtube.request.UserCreateRequest;
import com.example.japtube.request.UserUpsertRequest;
import com.example.japtube.security.UUIDTokenUtils;
import com.example.japtube.service.MailService;
import com.example.japtube.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    private final MailService mailService;

    private final UUIDTokenUtils uuidTokenUtils;

    private final UserRepository userRepository;

    //1. GET: get user by id
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
        UserPublic user = userService.getUserById(userId);
        return ResponseEntity.ok().body(user);
    }

    //2. POST: create new user
    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody UserCreateRequest request) {
        //validate token
        TokenVerify tokenVerify = uuidTokenUtils.validateAccountVerifyToken(request.getVerifyToken());
        log.info("tokenConfirm: {}", tokenVerify.getToken());
        UserPublic newUser = userService.createUser(request);
        return ResponseEntity.ok().body(newUser);
    }

    //post user create request
    @PostMapping("/create-token-request")
    public ResponseEntity<?> sendMailToGetToken(@RequestParam String email) {
        //check if email duplicated
        boolean isExistEmail = userRepository.existsByEmail(email);
        if (isExistEmail) {
            throw new BadRequestException("Email duplicated, please provide another email");
        }

        //generate token
        TokenVerify token = uuidTokenUtils.generateAccountVerifyToken();

        //Send email chứa token
        mailService.sendMail(
                email,
                "Xác thực email: "+ email,
                "Click vào link để tiếp tục tạo tài khoản: http://localhost:3000/account-verify/" + token.getToken() + "\n"
                    + "Link sẽ hết hạn sau 10 phút");
        return ResponseEntity.ok().body(new ResponseObject(HttpStatus.OK, token.getToken()));
    }

    //3. PUT: Upsert user
    @PutMapping("/{userId}/update-user")
    public ResponseEntity<?> upsertUser(@PathVariable Integer userId,
                                        @RequestBody UserUpsertRequest request){
        UserPublic updatedUser = userService.upsertUser(userId, request);
        return ResponseEntity.ok().body(updatedUser);
    }

    //GET: Get user profile by email
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam String email) {
        UserPublic user = userService.getUserProfile(email);
        return ResponseEntity.ok().body(user);
    }
}
