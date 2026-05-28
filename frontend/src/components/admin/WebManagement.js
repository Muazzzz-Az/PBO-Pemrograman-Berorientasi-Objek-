import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Divider } from '@mui/material';

function WebManagement() {
  // Data statistik mini platform Creartsl
  const stats = [
    { title: 'Total Pengguna', count: '1,240', color: '#1A6B8A' },
    { title: 'Kreator Terverifikasi', count: '84', color: '#4A9FBF' },
    { title: 'Transaksi Berjalan', count: '310', color: '#10B981' }
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ color: '#1A6B8A', fontWeight: 700, mb: 3 }}>
        Manajemen Informasi Platform
      </Typography>

      {/* Grid Statistik */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(74, 159, 191, 0.1)', borderLeft: `6px solid ${stat.color}` }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary" fontWeight={600}>{stat.title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color, mt: 1 }}>{stat.count}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Kontrol Tambahan */}
      <Card sx={{ borderRadius: '12px', p: 1, bgcolor: '#FFFDFA', border: '1px solid #FEF3C7' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#D97706', mb: 1 }}>
            Zona Moderasi & Pemeliharaan Web
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Gunakan tombol di bawah jika ingin mengaktifkan mode pemeliharaan (Maintenance Mode) pada server frontend/backend Creartsl.
          </Typography>
          <Button variant="outlined" color="warning" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}>
            Aktifkan Maintenance Mode
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default WebManagement;