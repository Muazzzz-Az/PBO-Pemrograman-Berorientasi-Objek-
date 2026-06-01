// src/components/admin/WebManagement.js - Real-time Data
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Divider } from '@mui/material';

function WebManagement() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedArtists: 0,
    ongoingTransactions: 0,
    totalCommissions: 0,
    totalProducts: 0,
    totalPortfolios: 0
  });

  // Fungsi untuk menghitung data real-time dari localStorage
  const loadRealTimeStats = () => {
    // 1. Total Pengguna (dari registered_users)
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const totalUsers = registeredUsers.length;

    // 2. Kreator Terverifikasi (isVerified = true)
    const verifiedArtists = registeredUsers.filter(u => u.isVerified === true).length;

    // 3. Total Komisi (dari creartsi_artist_commissions)
    const commissions = JSON.parse(localStorage.getItem('creartsi_artist_commissions') || '[]');
    const totalCommissions = commissions.length;

    // 4. Total Produk Shop (dari creartsi_shop_products)
    const products = JSON.parse(localStorage.getItem('creartsi_shop_products') || '[]');
    const totalProducts = products.length;

    // 5. Total Portfolio (dari creartsi_artist_portfolio)
    const portfolios = JSON.parse(localStorage.getItem('creartsi_artist_portfolio') || '[]');
    const totalPortfolios = portfolios.length;

    // 6. Transaksi Berjalan (pending payments)
    const transactions = JSON.parse(localStorage.getItem('creartsi_transactions') || '[]');
    const ongoingTransactions = transactions.filter(t =>
      t.status === 'waiting_payment' || t.status === 'pending_verification'
    ).length;

    setStats({
      totalUsers,
      verifiedArtists,
      ongoingTransactions,
      totalCommissions,
      totalProducts,
      totalPortfolios
    });
  };

  // Load data saat komponen mount
  useEffect(() => {
    loadRealTimeStats();

    // Listen untuk perubahan data (real-time update)
    const handleStorageChange = () => {
      loadRealTimeStats();
    };
    window.addEventListener('storage', handleStorageChange);

    // Custom event untuk update
    window.addEventListener('commissionDataChanged', handleStorageChange);
    window.addEventListener('shopDataChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('commissionDataChanged', handleStorageChange);
      window.removeEventListener('shopDataChanged', handleStorageChange);
    };
  }, []);

  const statsCards = [
    {
      title: 'Total Pengguna',
      count: stats.totalUsers,
      color: '#1A6B8A',
      subtitle: 'User terdaftar'
    },
    {
      title: 'Kreator Terverifikasi',
      count: stats.verifiedArtists,
      color: '#4A9FBF',
      subtitle: 'Artist aktif'
    },
    {
      title: 'Total Komisi',
      count: stats.totalCommissions,
      color: '#10B981',
      subtitle: 'Paket komisi'
    },
    {
      title: 'Produk Shop',
      count: stats.totalProducts,
      color: '#8B5CF6',
      subtitle: 'Digital products'
    },
    {
      title: 'Portfolio',
      count: stats.totalPortfolios,
      color: '#F59E0B',
      subtitle: 'Karya seni'
    },
    {
      title: 'Transaksi Berjalan',
      count: stats.ongoingTransactions,
      color: '#EF4444',

      subtitle: 'Pending payment'
    }
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ color: '#1A6B8A', fontWeight: 700, mb: 3 }}>
        Manajemen Informasi Platform
      </Typography>

      {/* Grid Statistik Real-time */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card sx={{
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(74, 159, 191, 0.1)',
              borderLeft: `6px solid ${stat.color}`,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="textSecondary" fontWeight={600}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontSize: '1.8rem' }}>
                    {stat.icon}
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color, mt: 1 }}>
                  {stat.count.toLocaleString('id-ID')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.subtitle}
                </Typography>
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
            Gunakan tombol di bawah untuk refresh data atau membersihkan cache.
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              color="warning"
              onClick={loadRealTimeStats}
              sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}
            >
              🔄 Refresh Data
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                if (window.confirm('Hapus semua data? (Tidak bisa dibatalkan)')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}
            >
              Clear All Data
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            ⏱️ Data terakhir diperbarui: {new Date().toLocaleTimeString()}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default WebManagement;