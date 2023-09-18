package com.example.japtube.service;

import com.example.japtube.dto.projection.PlaylistPublic;
import com.example.japtube.entity.Playlist;
import com.example.japtube.entity.Shorts;
import com.example.japtube.entity.User;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.repository.PlaylistRepository;
import com.example.japtube.repository.ShortsRepository;
import com.example.japtube.repository.UserRepository;
import com.example.japtube.request.PlaylistCreateRequest;
import com.example.japtube.request.PlaylistUpsertRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PlaylistService {
    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private UserRepository userRepository;

    @PersistenceContext
    EntityManager entityManager;

    //create playlist
    public PlaylistPublic createPlaylist(PlaylistCreateRequest request){
        //find user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> {throw new NotFoundException("User id " + request.getUserId() + " not found");});

        Playlist playlist = Playlist.builder()
                .name(request.getName())
                .user(user)
                .shorts(new HashSet<>())
                .build();

        playlistRepository.save(playlist);

        return PlaylistPublic.of(playlist);
    }

    //view playlist by id
    public PlaylistPublic getPlaylistById(Integer playlistId){
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> {throw new NotFoundException("Playlist id " +  playlistId + " not found");});
        return PlaylistPublic.of(playlist);
    }

    //get all playlists of users
    public List<PlaylistPublic> getAllPlaylistOfUser(Integer userId){
        List<Playlist> playlists = playlistRepository.findByUser_Id(userId);
        return playlists.stream()
                .map(PlaylistPublic::of)
                .toList();
    }

    //edit playlist
    public PlaylistPublic updatePlaylist(PlaylistUpsertRequest request){
        //TODO: Consider if needed to check userId
        //find by id
        Playlist playlist = playlistRepository.findById(request.getPlaylistId())
                .orElseThrow(() -> {throw new NotFoundException("Playlist id " +  request.getPlaylistId() + " not found");});

        //update
        playlist.setName(request.getName()!=null?request.getName(): playlist.getName());
        playlistRepository.save(playlist);

        return PlaylistPublic.of(playlist);
    }

    //delete playlist =>  just remove the link between shorts & playlist, not affect shorts
    @Transactional
    public void deletePlaylist(Integer playlistId){
        //find playlist
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> {throw new NotFoundException("Playlist id " +  playlistId + " not found");});
        Set<Shorts> shorts = playlist.getShorts();
        try {
            //remove this playlist of each shorts related
            for (Shorts s: shorts) {
                s.getPlaylists().remove(playlist);
            }

            //clear all shorts of playlist
            playlist.getShorts().clear();
            playlistRepository.delete(playlist);
        } catch (Exception e) {
            throw new RuntimeException("Delete error!");
        }
    }
}
