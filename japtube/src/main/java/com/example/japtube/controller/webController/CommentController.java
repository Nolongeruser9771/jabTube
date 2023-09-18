package com.example.japtube.controller.webController;

import com.example.japtube.dto.projection.CommentPublic;
import com.example.japtube.entity.Comment;
import com.example.japtube.request.CommentCreateRequest;
import com.example.japtube.request.CommentUpdateRequest;
import com.example.japtube.service.CommentService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@AllArgsConstructor
public class CommentController {
    private final CommentService commentService;

    //1. POST: Create comment
    @PostMapping("/create")
    public ResponseEntity<?> createComment(@RequestParam Integer userId,
                                           @RequestParam Integer videoId,
                                           @RequestBody CommentCreateRequest request){
        CommentPublic comment = commentService.createComment(userId, videoId, request);
        return ResponseEntity.ok().body(comment);
    }

    //2. PUT: Edit comment
    @PutMapping("/edit")
    public ResponseEntity<?> editComment(@RequestParam Integer userId,
                                         @RequestBody CommentUpdateRequest request) {
        CommentPublic updatedComment = commentService.editComment(userId,request);
        return ResponseEntity.ok().body(updatedComment);
    }

    //3. GET: Get all comments by videoId
    @GetMapping("")
    public ResponseEntity<?> getAllComments(@RequestParam Integer videoId){
        List<CommentPublic> comments = commentService.getCommentsByVideoId(videoId);
        return ResponseEntity.ok().body(comments);
    }

    //4. DELETE: Delete own comments
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteComment(@RequestParam Integer userId,
                                           @RequestParam Integer commentId){
        commentService.deleteComment(userId, commentId);
        return ResponseEntity.ok().body("Successfully deleted comment");
    }
}
