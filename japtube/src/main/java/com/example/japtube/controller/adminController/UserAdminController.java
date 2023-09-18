package com.example.japtube.controller.adminController;

import com.example.japtube.dto.projection.UserPublic;
import com.example.japtube.entity.User;
import com.example.japtube.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
@AllArgsConstructor
public class UserAdminController {
    private final UserService userService;

    //1. GET: get users by roles
    @GetMapping("")
    public ResponseEntity<?> getAllUserByRoles(@RequestParam String role) {
        List<UserPublic> userList = userService.getUsersByRole(role);
        return ResponseEntity.ok().body(userList);
    }

    //2. PUT: remove admin role
    @PutMapping("/remove-role")
    public ResponseEntity<?> removeAdminRole(@RequestParam Integer userId){
        UserPublic user =  userService.removeAdminRole(userId);
        return ResponseEntity.ok().body(user);
    }

    //3. PUT: add admin role
    @PutMapping("/add-role")
    public ResponseEntity<?> addAdminRole(@RequestParam Integer userId){
        UserPublic user =  userService.addAdminRole(userId);
        return ResponseEntity.ok().body(user);
    }

    //4. GET: get user not contain role
    @GetMapping("/search-not-contain")
    public ResponseEntity<?> getUsersNotContainsRole(@RequestParam String role){
        List<UserPublic> users = userService.getUsersNotContainsRole(role);
        return ResponseEntity.ok().body(users);
    }
}
