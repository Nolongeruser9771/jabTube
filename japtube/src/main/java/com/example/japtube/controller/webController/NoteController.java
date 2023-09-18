package com.example.japtube.controller.webController;

import com.example.japtube.dto.projection.NotePublic;
import com.example.japtube.request.NoteCreateRequest;
import com.example.japtube.request.NoteUpdateRequest;
import com.example.japtube.service.NoteService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notes")
@AllArgsConstructor
public class NoteController {
    private final NoteService noteService;

    //1. GET: get notes by shorts id
    @GetMapping("")
    public ResponseEntity<?> getAllNotesByShortsId(@RequestParam Integer shortsId){
        List<NotePublic> noteList = noteService.getAllNotesByShortsId(shortsId);
        return ResponseEntity.ok().body(noteList);
    }

    //2. POST: Create note
    @PostMapping("/create")
    public ResponseEntity<?> createNote(@RequestParam Integer userId,
                                        @RequestParam Integer shortsId,
                                        @RequestBody NoteCreateRequest request){
        NotePublic note = noteService.createNote(userId,shortsId,request);
        return ResponseEntity.ok().body(note);
    }

    //3. PUT: Edit note
    @PutMapping("/edit")
    public ResponseEntity<?> editNote(@RequestBody NoteUpdateRequest request) {
        NotePublic updatedNote = noteService.editComment(request);
        return ResponseEntity.ok().body(updatedNote);
    }

    //4. DELETE: Delete notes
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteComment(@RequestParam Integer noteId){
        noteService.deleteNote(noteId);
        return ResponseEntity.ok().body("Successfully deleted note!");
    }
}
