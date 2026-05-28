package org.example.controller;

import org.example.entity.Commission;
import org.example.service.CommissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/commissions")
@CrossOrigin(origins = "http://localhost:3000") // Izin akses dari React
public class CommissionController {

    private final CommissionService commissionService;

    public CommissionController(CommissionService commissionService) {
        this.commissionService = commissionService;
    }

    @GetMapping
    public ResponseEntity<List<Commission>> getAllCommissions() {
        return ResponseEntity.ok(commissionService.getAllCommissions());
    }

    @PostMapping
    public ResponseEntity<Commission> addCommission(@Valid @RequestBody Commission commission) {
        return ResponseEntity.ok(commissionService.addCommission(commission));
    }
}