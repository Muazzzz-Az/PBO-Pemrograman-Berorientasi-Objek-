package org.example.repository;
import org.example.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    // Query otomatis Spring Data JPA: cari artist berdasarkan artCategory
    List<Artist> findByArtCategory(String artCategory);

    // Cari berdasarkan genre (field lama)
    List<Artist> findByGenre(String genre);
}
