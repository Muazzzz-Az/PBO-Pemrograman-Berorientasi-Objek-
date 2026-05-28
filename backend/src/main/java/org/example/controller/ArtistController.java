package org.example.controller;
import org.example.entity.Artist;
import org.example.service.ArtistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/artists")
@CrossOrigin(origins = "http://localhost:3000") // URL Frontend
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    // Endpoint untuk mengambil semua data artis (GET)
    @GetMapping
    public ResponseEntity<List<Artist>> getAllArtists() {
        return ResponseEntity.ok(artistService.getAllArtists());
    }

    // Endpoint untuk menambah artis baru (POST)
    @PostMapping
    public ResponseEntity<Artist> addArtist(@Valid @RequestBody Artist artist) {
        return ResponseEntity.ok(artistService.addArtist(artist));
    }
}