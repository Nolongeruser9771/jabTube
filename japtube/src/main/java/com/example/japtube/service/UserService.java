package com.example.japtube.service;

import com.example.japtube.dto.projection.UserPublic;
import com.example.japtube.entity.Role;
import com.example.japtube.entity.User;
import com.example.japtube.exception.BadRequestException;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.modal.TokenConfirm;
import com.example.japtube.repository.RoleRepository;
import com.example.japtube.repository.UserRepository;
import com.example.japtube.request.UserCreateRequest;
import com.example.japtube.request.UserUpsertRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //get user by roles (admin)
    public List<UserPublic> getUsersByRole(String role){
        List<User> users = userRepository.findByRoles_Role(role);
        return users.stream().map(UserPublic::of).toList();
    }

    //get users (not admin)
    public List<UserPublic> getUsersNotContainsRole(String role){
        List<User> users = userRepository.findByRoles_RoleNot(role);
        return users.stream().map(UserPublic::of).toList();
    }

    //get user by id
    public UserPublic getUserById(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new NotFoundException("User id "+ userId +" not found")
        );
        return UserPublic.of(user);
    }

    //create new user
    public UserPublic createUser(UserCreateRequest request) {
        //validate email: if email is unique?
        Boolean isValidEmail = userRepository.existsByEmail(request.getEmail());
        if (isValidEmail) {
            throw new BadRequestException("Email " + request.getEmail() + " is existed! Please choose another email");
        }

        //Default role : normal_user (id:1)
        Role normal_user = roleRepository.findByRole("USER_NORMAL").orElse(null);
        User user = User.builder()
                .name(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .vipActive(false)
                .roles(List.of(normal_user))
                .build();
        userRepository.save(user);

        return UserPublic.of(user);
    }

    //upsert user
    public UserPublic upsertUser(Integer id, UserUpsertRequest request){
        //validate userId: isUserId existed?
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new NotFoundException("User "+ id +" not found");
        }
        User user2Upsert = user.get();

        //validate request email: email existed?
        if (!request.getEmail().equals(user2Upsert.getEmail())) {
            Boolean isValidEmail = userRepository.existsByEmail(request.getEmail());
            if (isValidEmail) {
                throw new BadRequestException("Email " + request.getEmail() + " is existed! Please choose another email");
            }
        }
        user2Upsert.setName(request.getUsername()!=null? request.getUsername() : user2Upsert.getUsername());
        user2Upsert.setEmail(request.getEmail()!=null? request.getEmail() : user2Upsert.getEmail());

        userRepository.save(user2Upsert);
        return UserPublic.of(user2Upsert);
    }

    //admin task: remove admin role
    public UserPublic removeAdminRole(Integer userId){
        //find user
        User user =userRepository.findById(userId)
                .orElseThrow(()->{throw new NotFoundException("User id " + userId + " not found");});

        //set role
        Role adminRole = roleRepository.findByRole("ADMIN").orElse(null);
        if (adminRole!=null) {
            user.getRoles().remove(adminRole);
            userRepository.save(user);
        }
        return UserPublic.of(user);
    }

    //admin task: add admin role
    public UserPublic addAdminRole(Integer userId){
        //find user
        User user =userRepository.findById(userId)
                .orElseThrow(()->{throw new NotFoundException("User id " + userId + " not found");});

        //set role
        Role adminRole = roleRepository.findByRole("ADMIN").orElse(null);
        if (adminRole!=null) {
            user.getRoles().add(adminRole);
            userRepository.save(user);
        }
        return UserPublic.of(user);
    }

    //get user profile
    public UserPublic getUserProfile(String email) {
        //find user
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new NotFoundException("No user founded. Please check email or password.");
        }
        return UserPublic.of(user.get());
    }

    //change password
    public void changePassword(Integer userId, String password, String confirmPassword){
        if (!Objects.equals(password, confirmPassword)) {
            throw new BadRequestException("Password not matching");
        }

        //find user
        User user =userRepository.findById(userId)
                .orElseThrow(()->{throw new NotFoundException("User id " + userId + " not found");});

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }
}
