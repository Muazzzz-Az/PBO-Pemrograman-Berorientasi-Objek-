package org.example.service;
import org.example.entity.Commission;
import java.util.List;
import java.util.Optional;

// Pilar OOP: ABSTRACTION — Interface mendefinisikan kontrak operasi Commission
public interface CommissionService {
    List<Commission> getAllCommissions();                              // Ambil semua komisi
    Optional<Commission> getCommissionById(Long id);                  // Ambil komisi by ID
    List<Commission> getCommissionsByArtistId(Long artistId);         // Ambil komisi by artist
    Commission addCommission(Commission commission);                   // Tambah komisi baru
    Commission updateCommission(Long id, Commission commission);       // Update komisi
}
