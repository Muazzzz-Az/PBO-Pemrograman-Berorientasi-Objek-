package org.example.repository;

import org.example.entity.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommissionRepository extends JpaRepository<Commission, Long> {
    // Cari semua komisi milik artist tertentu
    List<Commission> findByArtistId(Long artistId);

    // Cari komisi yang masih buka
    List<Commission> findByIsOpen(Boolean isOpen);
}
