package com.example.japtube.service;

import com.example.japtube.dto.projection.CommentPublic;
import com.example.japtube.entity.Comment;
import com.example.japtube.entity.User;
import com.example.japtube.entity.Video;
import com.example.japtube.exception.BadRequestException;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.repository.CommentRepository;
import com.example.japtube.repository.UserRepository;
import com.example.japtube.repository.VideoRepository;
import com.example.japtube.request.CommentCreateRequest;
import com.example.japtube.request.CommentUpdateRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VideoRepository videoRepository;

    //Create comments
    public CommentPublic createComment(Integer userId, Integer videoId, CommentCreateRequest request){
        //find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { throw new NotFoundException("User id " + userId + " not found");});
        //find video
        Video video = videoRepository.findByIdAndStatus(videoId,true)
                .orElseThrow(() -> { throw new NotFoundException("Video id " + videoId + " not found");});

        Comment comment = Comment.builder()
                .user(user)
                .video(video)
                .content(request.getContent())
                .build();
        commentRepository.save(comment);
        return CommentPublic.of(comment);
    }

    //Update comments
    @Transactional
    public CommentPublic editComment(Integer userId, CommentUpdateRequest request) {
        //find comment
        Comment comment = commentRepository.findById(request.getCommentId())
                .orElseThrow(() -> { throw new NotFoundException("Comment id " + request.getCommentId() + " not found");});

        //validate user
        if (comment.getUser().getId()!=userId){
            throw new BadRequestException("Only own user can edit their comment, so user id " + userId
                                        + " cannot edit comment id " + request.getCommentId());}
        //update content
        comment.setContent(request.getContent());
        commentRepository.save(comment);
        return CommentPublic.of(comment);
    }

    //Get comments by videoId
    public List<CommentPublic> getCommentsByVideoId(Integer videoId){
        List<Comment> comments = commentRepository.findByVideo_IdOrderByCreatedAtDesc(videoId);
        return comments.stream().map(CommentPublic::of).toList();
    }

    //Delete comments (only comments' owner can delete their own comments)
    @Transactional
    public void deleteComment(Integer userId, Integer commentId){
        //find comment
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> { throw new NotFoundException("Comment id " + commentId + " not found");});

        //validate user
        if (comment.getUser().getId()!=userId){
            throw new BadRequestException("Only own user can delete their comment, so user id " + userId
                    + " cannot delete comment id " + commentId);}
        //delete comment
        commentRepository.delete(comment);
    }
}
