package org.example.controller;
import org.example.entity.Artist;
import org.example.service.ArtistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/artists")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @GetMapping
    public ResponseEntity<List<Artist>> getAllArtists() {
        return ResponseEntity.ok(artistService.getAllArtists());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Artist> getArtistById(@PathVariable Long id) {
        return artistService.getArtistById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Artist>> getArtistsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(artistService.getArtistsByCategory(category));
    }

    @PostMapping
    public ResponseEntity<Artist> addArtist(@Valid @RequestBody Artist artist) {
        return ResponseEntity.ok(artistService.addArtist(artist));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Artist> updateArtist(@PathVariable Long id, @RequestBody Artist artist) {
        return ResponseEntity.ok(artistService.updateArtist(id, artist));
    }
}
