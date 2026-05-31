package org.example.service;
import org.example.entity.Artist;
import java.util.List;
import java.util.Optional;

// Pilar OOP: ABSTRACTION — Interface mendefinisikan kontrak operasi Artist
// tanpa mengekspos detail implementasi database
public interface ArtistService {
    List<Artist> getAllArtists();                          // Ambil semua artist
    Optional<Artist> getArtistById(Long id);              // Ambil artist by ID
    List<Artist> getArtistsByCategory(String category);   // Filter by kategori
    Artist addArtist(Artist artist);                      // Tambah artist baru
    Artist updateArtist(Long id, Artist artist);          // Update data artist
}
