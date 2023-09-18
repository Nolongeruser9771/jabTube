package com.example.japtube.controller.webController;

import com.example.japtube.dto.projection.PlaylistPublic;
import com.example.japtube.modal.ResponseObject;
import com.example.japtube.request.PlaylistCreateRequest;
import com.example.japtube.request.PlaylistUpsertRequest;
import com.example.japtube.service.PlaylistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/playlists")
public class PlaylistController {
    @Autowired
    private PlaylistService playlistService;

    //1. GET: Get playlist by id
    @GetMapping("/search")
    public ResponseEntity<?> getPlaylistById(@RequestParam Integer playlistId){
        PlaylistPublic playlist = playlistService.getPlaylistById(playlistId);
        return ResponseEntity.ok().body(playlist);
    }

    //2. GET: Get all playlist of user
    @GetMapping("")
    public ResponseEntity<?> getAllPlaylistsOfUser(@RequestParam Integer userId){
        List<PlaylistPublic> playlists = playlistService.getAllPlaylistOfUser(userId);
        return ResponseEntity.ok().body(playlists);
    }

    //3. POST: Create playlist
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_VIP')")
    @PostMapping("/create")
    public ResponseEntity<?> createPlaylist(@RequestBody @Valid PlaylistCreateRequest request){
        PlaylistPublic newPlaylist = playlistService.createPlaylist(request);
        return ResponseEntity.ok().body(newPlaylist);
    }

    //4. PUT: Edit playlist
    @PutMapping("")
    public ResponseEntity<?> updatePlaylist(@RequestBody PlaylistUpsertRequest request){
        PlaylistPublic updatedPlaylist = playlistService.updatePlaylist(request);
        return ResponseEntity.ok().body(updatedPlaylist);
    }

    //5. DELETE: delete playlist
    @DeleteMapping("")
    public ResponseEntity<?> deletePlaylist(@RequestParam Integer playlistId){
        playlistService.deletePlaylist(playlistId);
        return ResponseEntity.ok().body(new ResponseObject(HttpStatus.OK, "Successfully deleted"));
    }
}
