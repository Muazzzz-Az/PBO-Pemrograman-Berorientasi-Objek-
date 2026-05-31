package org.example.service;
import org.example.entity.Artist;
import java.util.List;
import java.util.Optional;

public interface ArtistService {
    List<Artist> getAllArtists();
    Optional<Artist> getArtistById(Long id);
    List<Artist> getArtistsByCategory(String category);
    Artist addArtist(Artist artist);
    Artist updateArtist(Long id, Artist artist);
}
