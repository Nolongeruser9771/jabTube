package com.example.japtube.dto.projection;

import com.example.japtube.entity.Role;
import com.example.japtube.entity.User;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public interface UserPublic {
    Integer getId();

    String getUsername();

    String getEmail();

    String getAvatar();

    Boolean getVipActive();

    List<Role> getRoles();

    LocalDateTime getCreateAt();

    @RequiredArgsConstructor
    class UserPublicImpl implements UserPublic {
        private final User user;

        @Override
        public Integer getId() {
            return this.user.getId();
        }

        @Override
        public String getUsername() {
            return this.user.getName();
        }

        @Override
        public String getEmail() {
            return this.user.getEmail();
        }

        @Override
        public String getAvatar() {
            return this.user.getAvatar();
        }

        @Override
        public Boolean getVipActive() {return this.user.getVipActive();}

        @Override
        public List<Role> getRoles() {
            return this.user.getRoles();
        }

        @Override
        public LocalDateTime getCreateAt() {
            return this.user.getCreateAt();
        }
    }

    static UserPublic of (User user) {
        return new UserPublicImpl(user);
    }
}
