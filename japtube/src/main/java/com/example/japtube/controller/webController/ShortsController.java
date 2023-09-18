package com.example.japtube.controller.webController;

import com.example.japtube.dto.projection.ShortsPublic;
import com.example.japtube.modal.ResponseObject;
import com.example.japtube.request.ShortsCreateRequest;
import com.example.japtube.request.ShortsUpsertRequest;
import com.example.japtube.service.ShortService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("api/v1/shorts")
public class ShortsController {
    @Autowired
    private ShortService shortService;

    //1. GET: get shorts by id
    @GetMapping("/search")
    public ResponseEntity<?> getShortsById(@RequestParam Integer shortsId,
                                           @RequestParam Integer userId){
        ShortsPublic shorts = shortService.getShortsById(shortsId, userId);
        return ResponseEntity.ok().body(shorts);
    }

    //2. GET: get shorts list of user
    @GetMapping("")
    public ResponseEntity<?> getAllShortsOfUser(@RequestParam Integer userId){
        List<ShortsPublic> shortsList = shortService.getAllShortsOfUser(userId);
        return ResponseEntity.ok().body(shortsList);
    }

    //3. POST: Create shorts
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_VIP')")
    @PostMapping("/create")
    public ResponseEntity<?> createShorts(@RequestBody @Valid ShortsCreateRequest request){
        ShortsPublic newShorts = shortService.createShorts(request);
        return ResponseEntity.ok().body(newShorts);
    }

    //4. PUT: Edit shorts
    @PutMapping("")
    public ResponseEntity<?> updateShorts(@RequestBody @Valid ShortsUpsertRequest request){
        ShortsPublic updatedShorts = shortService.updateShorts(request);
        return ResponseEntity.ok().body(updatedShorts);
    }

    //5. DELETE: Delete shorts
    @DeleteMapping("")
    public ResponseEntity<?> deleteShorts(@RequestParam Integer shortsId){
        shortService.deleteShorts(shortsId);
        return ResponseEntity.ok().body(new ResponseObject(HttpStatus.OK, "Successfully deleted"));
    }

    //6. GET: view shorts
    @GetMapping("view-short/{shortId}")
    public ResponseEntity<?> viewShort(@PathVariable Integer shortId,
                                       @RequestParam Integer userId) throws IOException {
        Path shortPath = shortService.viewShorts(shortId, userId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("video/mp4"))
                .body(Files.readAllBytes(shortPath));
    }
}
