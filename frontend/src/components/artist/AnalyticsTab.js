// src/components/artist/AnalyticsTab.js - Real-time Analytics
import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Stack,
  Divider, LinearProgress, Paper, Avatar
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  People as PeopleIcon,
  Brush as BrushIcon,
  TrendingUp as TrendingIcon,
  Store as StoreIcon
} from '@mui/icons-material';

// Keys untuk mengambil data
const SHOP_PRODUCTS_KEY = 'creartsi_shop_products';
const SHOP_PURCHASES_KEY = 'creartsi_shop_purchases';
const COMMISSIONS_KEY = 'creartsi_artist_commissions';
const PORTFOLIO_KEY = 'creartsi_artist_portfolio';

function AnalyticsTab({ user }) {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
    totalCommissions: 0,
    totalPortfolio: 0,
    monthlySales: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  const loadAnalytics = () => {
    setLoading(true);

    // Ambil data dari localStorage
    const products = JSON.parse(localStorage.getItem(SHOP_PRODUCTS_KEY) || '[]');
    const purchases = JSON.parse(localStorage.getItem(SHOP_PURCHASES_KEY) || '[]');
    const commissions = JSON.parse(localStorage.getItem(COMMISSIONS_KEY) || '[]');
    const portfolios = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || '[]');

    // Filter berdasarkan artist yang login
    const myProducts = products.filter(p => p.artistId === user?.id);
    const mySales = purchases.filter(p => p.artistId === user?.id);
    const myCommissions = commissions.filter(c => c.artistId === user?.id);
    const myPortfolio = portfolios.filter(p => p.artistId === user?.id);

    // Hitung total pendapatan
    const totalRevenue = mySales.reduce((sum, sale) => sum + (sale.productPrice || 0), 0);

    // Hitung produk terlaris
    const productSales = {};
    mySales.forEach(sale => {
      const title = sale.productTitle;
      productSales[title] = (productSales[title] || 0) + 1;
    });
    const topProducts = Object.entries(productSales)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Statistik bulanan (30 hari terakhir)
    const last30Days = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dailySales = mySales.filter(sale =>
        sale.purchaseDate?.startsWith(dateStr)
      );
      last30Days.unshift({
        date: dateStr,
        sales: dailySales.length,
        revenue: dailySales.reduce((sum, s) => sum + (s.productPrice || 0), 0)
      });
    }

    setStats({
      totalRevenue,
      totalSales: mySales.length,
      totalProducts: myProducts.length,
      totalCommissions: myCommissions.length,
      totalPortfolio: myPortfolio.length,
      monthlySales: last30Days.slice(-7), // 7 hari terakhir
      topProducts
    });
    setLoading(false);
  };

  useEffect(() => {
    loadAnalytics();

    // Auto refresh setiap 30 detik
    const interval = setInterval(loadAnalytics, 30000);

    // Listen untuk perubahan data
    const handleUpdate = () => loadAnalytics();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('shopDataChanged', handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('shopDataChanged', handleUpdate);
    };
  }, [user?.id]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress sx={{ borderRadius: 2 }} />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading analytics...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color="#1A6B8A" sx={{ mb: 3 }}>
        📊 Analytics Dashboard
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', bgcolor: '#E8F5E9' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Revenue</Typography>
                  <Typography variant="h5" fontWeight={800} color="#2E7D32">
                    Rp {stats.totalRevenue.toLocaleString('id-ID')}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#4CAF50' }}><MoneyIcon /></Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', bgcolor: '#E3F2FD' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Sales</Typography>
                  <Typography variant="h5" fontWeight={800} color="#1565C0">
                    {stats.totalSales}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2196F3' }}><CartIcon /></Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', bgcolor: '#FFF3E0' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">Products</Typography>
                  <Typography variant="h5" fontWeight={800} color="#E65100">
                    {stats.totalProducts}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#FF9800' }}><StoreIcon /></Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', bgcolor: '#F3E5F5' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">Commissions</Typography>
                  <Typography variant="h5" fontWeight={800} color="#6A1B9A">
                    {stats.totalCommissions}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#9C27B0' }}><BrushIcon /></Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Sales Chart (sederhana) */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} color="#1A6B8A" sx={{ mb: 2 }}>
                Last 7 Days Sales
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 200 }}>
                {stats.monthlySales.map((day, idx) => {
                  const maxSales = Math.max(...stats.monthlySales.map(d => d.sales), 1);
                  const height = (day.sales / maxSales) * 150;
                  return (
                    <Box key={idx} sx={{ flex: 1, textAlign: 'center' }}>
                      <Box sx={{
                        height: height,
                        bgcolor: '#4A9FBF',
                        borderRadius: '8px 8px 0 0',
                        transition: 'height 0.3s'
                      }} />
                      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </Typography>
                      <Typography variant="caption" fontWeight={600}>
                        {day.sales} sale
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} color="#1A6B8A" sx={{ mb: 2 }}>
                Top Selling Products
              </Typography>
              {stats.topProducts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                  No sales yet. Start selling!
                </Typography>
              ) : (
                stats.topProducts.map((product, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: '60%' }}>
                        {idx + 1}. {product.name}
                      </Typography>
                      <Typography variant="body2" color="#4A9FBF" fontWeight={700}>
                        {product.count} sold
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(product.count / stats.topProducts[0]?.count) * 100}
                      sx={{ mt: 0.5, borderRadius: 2, height: 6 }}
                    />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Tips */}
      <Card sx={{ mt: 3, borderRadius: '16px', bgcolor: '#F0F9FF' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TrendingIcon sx={{ color: '#4A9FBF', fontSize: 32 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>Performance Tips</Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.totalProducts === 0 && "Add products to start selling! "}
                {stats.totalSales === 0 && "🛍Promote your shop to increase sales. "}
                {stats.totalSales > 0 && "Great job! Keep adding more products to grow your revenue!"}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AnalyticsTab;