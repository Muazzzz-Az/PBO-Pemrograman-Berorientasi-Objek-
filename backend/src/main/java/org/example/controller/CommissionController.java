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

    @GetMapping
    public ResponseEntity<List<Commission>> getAllCommissions() {
        return ResponseEntity.ok(commissionService.getAllCommissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commission> getCommissionById(@PathVariable Long id) {
        return commissionService.getCommissionById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<Commission>> getCommissionsByArtist(@PathVariable Long artistId) {
        return ResponseEntity.ok(commissionService.getCommissionsByArtistId(artistId));
    }

    @PostMapping
    public ResponseEntity<Commission> addCommission(@Valid @RequestBody Commission commission) {
        return ResponseEntity.ok(commissionService.addCommission(commission));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Commission> updateCommission(@PathVariable Long id, @RequestBody Commission commission) {
        return ResponseEntity.ok(commissionService.updateCommission(id, commission));
    }
}
