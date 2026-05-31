package org.example.service;
import org.example.entity.Artist;
import org.example.repository.ArtistRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ArtistServiceImpl implements ArtistService {

    private final ArtistRepository artistRepository;

    public ArtistServiceImpl(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    @Override
    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }

    @Override
    public Optional<Artist> getArtistById(Long id) {
        return artistRepository.findById(id);
    }

    @Override
    public List<Artist> getArtistsByCategory(String category) {
        List<Artist> result = artistRepository.findByArtCategory(category);
        if (result.isEmpty()) {
            result = artistRepository.findByGenre(category);
        }
        return result;
    }

    @Override
    public Artist addArtist(Artist artist) {
        if (artist.getArtistName() == null || artist.getArtistName().isEmpty()) {
            artist.setArtistName(artist.getName());
        }
        if (artist.getArtCategory() == null || artist.getArtCategory().isEmpty()) {
            artist.setArtCategory(artist.getGenre());
        }
        return artistRepository.save(artist);
    }

    @Override
    public Artist updateArtist(Long id, Artist updatedArtist) {
        return artistRepository.findById(id).map(existing -> {
            if (updatedArtist.getName() != null) existing.setName(updatedArtist.getName());
            if (updatedArtist.getArtistName() != null) existing.setArtistName(updatedArtist.getArtistName());
            if (updatedArtist.getBio() != null) existing.setBio(updatedArtist.getBio());
            if (updatedArtist.getArtCategory() != null) existing.setArtCategory(updatedArtist.getArtCategory());
            if (updatedArtist.getProfilePicture() != null) existing.setProfilePicture(updatedArtist.getProfilePicture());
            if (updatedArtist.getIsVerified() != null) existing.setIsVerified(updatedArtist.getIsVerified());
            return artistRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Artist tidak ditemukan dengan id: " + id));
    }
}
