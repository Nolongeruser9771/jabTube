package com.example.japtube.controller.authController;

import com.example.japtube.entity.User;
import com.example.japtube.exception.BadRequestException;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.modal.JwtResponse;
import com.example.japtube.modal.ResponseObject;
import com.example.japtube.modal.TokenConfirm;
import com.example.japtube.repository.UserRepository;
import com.example.japtube.request.ChangePassRequest;
import com.example.japtube.request.LoginRequest;
import com.example.japtube.request.ResetPasswordRequest;
import com.example.japtube.security.CustomUserDetailService;
import com.example.japtube.security.JwtUtils;
import com.example.japtube.security.UUIDTokenUtils;
import com.example.japtube.service.MailService;
import com.example.japtube.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private MailService mailService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UUIDTokenUtils uuidTokenUtils;

    @Autowired
    private CustomUserDetailService customUserDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login-handle")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        //Tạo đối tượng xác thực (token -> làm tham số đầu vào cho AuthenticationManager)
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        //Tiến hành xác thực (Gọi phương thức tương ứng của AuthenticationManager)
        try {
            Authentication authentication = authenticationManager.authenticate(token);

            //Lưu đối tượng được xác thực vào contextHolder
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(authentication.getName());
            String jwtToken = jwtUtils.generateToken(userDetails);

            log.info(String.valueOf(userDetails.getAuthorities()));

            return ResponseEntity.ok().body(new JwtResponse(jwtToken)); //gửi token về cho client

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ResponseObject(HttpStatus.BAD_REQUEST, "Login failed"));
        }
    }

    //forgot password request
    @PostMapping("/forgot-password")
    public ResponseEntity<?> sendMailToResetPassword(@RequestParam String email) {
        //generate token
        TokenConfirm token = uuidTokenUtils.generateToken(email);

        //Send email chứa token
        mailService.sendMail(
                email,
                "Reset password: "+ email,
                "Click vào link để đổi mật khẩu: http://localhost:3000/change-password/" + token.getToken() + "\n"
                        + "Link sẽ hết hạn sau 10 phút");
        return ResponseEntity.ok().body(new ResponseObject(HttpStatus.OK, token.getToken()));
    }

    //Reset password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        //validate token
        TokenConfirm tokenConfirm = uuidTokenUtils.validateToken(request.getConfirmToken());
        userService.changePassword(tokenConfirm.getUser().getId(), request.getPassword(), request.getConfirmPassword());

        return ResponseEntity.ok().body(new ResponseObject(HttpStatus.OK, "Successfully change password"));
    }

    //request change password
    @PostMapping("/request-change-password")
    public ResponseEntity<?> changePasswordRequest(@RequestParam String oldPassword,
                                                   @RequestParam String email){
        //find user
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
        if (passwordEncoder.matches(oldPassword, userDetails.getPassword())) {
            return ResponseEntity.ok().body(new ResponseObject(HttpStatus.OK, "Request change password success!"));
        }
        throw new BadRequestException("Password not matching");
    }

    //change password
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePassRequest request) {
        if (!Objects.equals(request.getPassword(), request.getConfirmPassword())) {
            throw new BadRequestException("Password not matching");
        }
        //update password
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(()->{ throw new NotFoundException("User email " + request.getEmail() + " not found");});
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        //generate new jwtToken
        String jwtToken = jwtUtils.generateToken(user);

        //send email
        mailService.sendMail(
                request.getEmail(),
                "Thay đổi mật khẩu JapTube thành công!",
                "Tiếp tục trải nghiệm phim ảnh tại: http://localhost:3000");

        return ResponseEntity.ok().body(new JwtResponse(jwtToken));
    }
}
