package com.example.japtube.dto.projection;

import com.example.japtube.entity.Comment;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

public interface CommentPublic {
    Integer getId();

    String getContent();

    LocalDateTime getCreatedAt();

    LocalDateTime getUpdatedAt();

    UserCommentPublic getUser();

    VideoPublic getVideo();

    @RequiredArgsConstructor
    class CommentPublicImpl implements CommentPublic {
        private final Comment comment;

        @Override
        public Integer getId() {
            return this.comment.getId();
        }

        @Override
        public String getContent() {
            return this.comment.getContent();
        }

        @Override
        public LocalDateTime getCreatedAt() {
            return this.comment.getCreatedAt();
        }

        @Override
        public LocalDateTime getUpdatedAt() {
            return this.comment.getUpdatedAt();
        }

        @Override
        public UserCommentPublic getUser() {
            return UserCommentPublic.of(this.comment.getUser());
        }

        @Override
        @JsonIgnore
        public VideoPublic getVideo() {
            return VideoPublic.of(this.comment.getVideo());
        }
    }
    static CommentPublic of(Comment comment) {
        return new CommentPublicImpl(comment);
    }
}
