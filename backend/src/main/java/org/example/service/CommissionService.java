package org.example.service;

import org.example.entity.Commission;
import java.util.List;
import java.util.Optional;

public interface CommissionService {
    List<Commission> getAllCommissions();
    Optional<Commission> getCommissionById(Long id);
    List<Commission> getCommissionsByArtistId(Long artistId);
    Commission addCommission(Commission commission);
    Commission updateCommission(Long id, Commission commission);
}
