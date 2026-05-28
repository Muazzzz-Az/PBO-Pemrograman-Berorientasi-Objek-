package org.example.service;

import org.example.entity.Commission;
import java.util.List;

public interface CommissionService {
    List<Commission> getAllCommissions();
    Commission addCommission(Commission commission);
}