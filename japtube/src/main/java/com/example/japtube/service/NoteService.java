package com.example.japtube.service;

import com.example.japtube.dto.projection.NotePublic;
import com.example.japtube.entity.*;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.repository.NoteRepository;
import com.example.japtube.repository.ShortsRepository;
import com.example.japtube.repository.UserRepository;
import com.example.japtube.request.NoteCreateRequest;
import com.example.japtube.request.NoteUpdateRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {
    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private ShortsRepository shortsRepository;

    @Autowired
    private UserRepository userRepository;

    //get all notes of shorts
    public List<NotePublic> getAllNotesByShortsId(Integer shortsId){
        //find shorts
        Shorts shorts = shortsRepository.findById(shortsId)
                .orElseThrow(() -> {throw new NotFoundException("Shorts id " + shortsId + " not found");});

        List<Note> notes = noteRepository.findByShorts_Id(shortsId);
        return notes.stream().map(NotePublic::of).toList();
    }

    //Create notes
    public NotePublic createNote(Integer userId, Integer shortsId, NoteCreateRequest request){
        //find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { throw new NotFoundException("User id " + userId + " not found");});
        //find shorts
        Shorts shorts = shortsRepository.findById(shortsId)
                .orElseThrow(() -> { throw new NotFoundException("Shorts id " + shortsId + " not found");});

        Note newNote = Note.builder()
                .content(request.getContent())
                .shorts(shorts)
                .user(user)
                .build();
        noteRepository.save(newNote);
        return NotePublic.of(newNote);
    }

    //Update note
    @Transactional
    public NotePublic editComment(NoteUpdateRequest request) {
        //find note
        Note note = noteRepository.findById(request.getNoteId())
                .orElseThrow(() -> { throw new NotFoundException("Note id " + request.getNoteId() + " not found");});

        //update content
        note.setContent(request.getContent());
        noteRepository.save(note);
        return NotePublic.of(note);
    }

    //Delete note
    @Transactional
    public void deleteNote(Integer noteId){
        //find note
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> { throw new NotFoundException("Note id " + noteId + " not found");});

        //delete comment
        noteRepository.delete(note);
    }
}
