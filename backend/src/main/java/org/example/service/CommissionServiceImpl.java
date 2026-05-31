package org.example.service;
import org.example.entity.Commission;
import org.example.repository.CommissionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CommissionServiceImpl implements CommissionService {

    private final CommissionRepository commissionRepository;

    public CommissionServiceImpl(CommissionRepository commissionRepository) {
        this.commissionRepository = commissionRepository;
    }

    @Override
    public List<Commission> getAllCommissions() {
        return commissionRepository.findAll();
    }

    @Override
    public Optional<Commission> getCommissionById(Long id) {
        return commissionRepository.findById(id);
    }

    @Override
    public List<Commission> getCommissionsByArtistId(Long artistId) {
        return commissionRepository.findByArtistId(artistId);
    }

    @Override
    public Commission addCommission(Commission commission) {
        if (commission.getSlotsLeft() == null && commission.getSlots() != null) {
            commission.setSlotsLeft(commission.getSlots());
        }
        return commissionRepository.save(commission);
    }

    @Override
    public Commission updateCommission(Long id, Commission updatedCommission) {
        return commissionRepository.findById(id).map(existing -> {
            if (updatedCommission.getTitle() != null) existing.setTitle(updatedCommission.getTitle());
            if (updatedCommission.getCategory() != null) existing.setCategory(updatedCommission.getCategory());
            if (updatedCommission.getDescription() != null) existing.setDescription(updatedCommission.getDescription());
            if (updatedCommission.getPriceFrom() != null) existing.setPriceFrom(updatedCommission.getPriceFrom());
            if (updatedCommission.getPriceTo() != null) existing.setPriceTo(updatedCommission.getPriceTo());
            if (updatedCommission.getIsOpen() != null) existing.setIsOpen(updatedCommission.getIsOpen());
            if (updatedCommission.getSlotsLeft() != null) existing.setSlotsLeft(updatedCommission.getSlotsLeft());
            return commissionRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Commission tidak ditemukan dengan id: " + id));
    }
}
