package org.example.controller;

import org.example.entity.Commission;
import org.example.service.CommissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/commissions")
@CrossOrigin(origins = "http://localhost:3000")
public class CommissionController {

    private final CommissionService commissionService;

    public CommissionController(CommissionService commissionService) {
        this.commissionService = commissionService;
    }

    // GET semua komisi
    @GetMapping
    public ResponseEntity<List<Commission>> getAllCommissions() {
        return ResponseEntity.ok(commissionService.getAllCommissions());
    }

    // GET komisi by ID — dibutuhkan frontend CommissionService.getById()
    @GetMapping("/{id}")
    public ResponseEntity<Commission> getCommissionById(@PathVariable Long id) {
        return commissionService.getCommissionById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // GET komisi by artist ID — dibutuhkan untuk halaman profil artist
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<Commission>> getCommissionsByArtist(@PathVariable Long artistId) {
        return ResponseEntity.ok(commissionService.getCommissionsByArtistId(artistId));
    }

    // POST tambah komisi baru
    @PostMapping
    public ResponseEntity<Commission> addCommission(@Valid @RequestBody Commission commission) {
        return ResponseEntity.ok(commissionService.addCommission(commission));
    }

    // PUT update komisi
    @PutMapping("/{id}")
    public ResponseEntity<Commission> updateCommission(@PathVariable Long id, @RequestBody Commission commission) {
        return ResponseEntity.ok(commissionService.updateCommission(id, commission));
    }
}
