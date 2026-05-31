package org.example.repository;
import org.example.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    List<Artist> findByArtCategory(String artCategory);
    List<Artist> findByGenre(String genre);
}
