package org.example.service;
import org.example.entity.Artist;
import java.util.List;

public interface ArtistService {
    List<Artist> getAllArtists();
    Artist addArtist(Artist artist);
}