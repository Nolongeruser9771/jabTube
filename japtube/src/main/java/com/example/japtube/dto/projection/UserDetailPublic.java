package com.example.japtube.dto.projection;

import com.example.japtube.entity.Role;
import com.example.japtube.entity.User;
import com.example.japtube.entity.UserPackage;
import lombok.RequiredArgsConstructor;

import java.util.List;

public interface UserDetailPublic {
    Integer getId();

    String getUsername();

    String getEmail();

    String getAvatar();

    Boolean getVipActive();

    List<Role> getRoles();

    @RequiredArgsConstructor
    class UserDetailPublicImpl implements UserDetailPublic {
        private final User user;

        private final UserPackage userPackage;

        @Override
        public Integer getId() {
            return this.user.getId();
        }

        @Override
        public String getUsername() {
            return this.user.getUsername();
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
    }

    static UserDetailPublic of (User user, UserPackage userPackage) {
        return new UserDetailPublicImpl(user, userPackage);
    }
}
