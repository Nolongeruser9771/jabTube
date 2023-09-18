package com.example.japtube.dto.projection;

import com.example.japtube.entity.User;
import lombok.RequiredArgsConstructor;

public interface UserCommentPublic {
    Integer getId();

    String getUsername();

    String getAvatar();

    @RequiredArgsConstructor
    class UserCommentPublicImpl implements UserCommentPublic {
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
        public String getAvatar() {
            return this.user.getAvatar();
        }
    }
    static UserCommentPublic of (User user) {
        return new UserCommentPublicImpl(user);
    }
}
