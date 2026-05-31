package org.example.repository;
import org.example.entity.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommissionRepository extends JpaRepository<Commission, Long> {
    List<Commission> findByArtistId(Long artistId);
    List<Commission> findByIsOpen(Boolean isOpen);
}
