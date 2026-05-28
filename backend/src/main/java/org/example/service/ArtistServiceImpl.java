package org.example.service;
import org.example.entity.Artist;
import org.example.repository.ArtistRepository;
import org.springframework.stereotype.Service;
import java.util.List;

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
    public Artist addArtist(Artist artist) {
        return artistRepository.save(artist);
    }
}