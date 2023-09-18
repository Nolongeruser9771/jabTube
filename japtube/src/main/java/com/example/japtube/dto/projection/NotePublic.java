package com.example.japtube.dto.projection;

import com.example.japtube.entity.Note;
import lombok.RequiredArgsConstructor;

public interface NotePublic {

    Integer getId();

    String getContent();

    @RequiredArgsConstructor
    class NotePublicImpl implements NotePublic {
        private final Note note;

        @Override
        public Integer getId() {
            return this.note.getId();
        }

        @Override
        public String getContent() {
            return this.note.getContent();
        }
    }
    static NotePublic of (Note note) {return new NotePublicImpl(note);}
}
