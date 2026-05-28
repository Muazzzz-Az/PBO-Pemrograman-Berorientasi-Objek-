package org.example.service;

import org.example.entity.Commission;
import org.example.repository.CommissionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

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
    public Commission addCommission(Commission commission) {
        return commissionRepository.save(commission);
    }
}