// src/components/MyPurchasesPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  IconButton,
  Stack,
  Divider,
  Paper
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StoreIcon from '@mui/icons-material/Store';

const SHOP_PURCHASES_KEY = 'creartsi_shop_purchases';

function MyPurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser) return;
    loadPurchases();
  }, [currentUser]);

  const loadPurchases = () => {
    const allPurchases = JSON.parse(localStorage.getItem(SHOP_PURCHASES_KEY) || '[]');
    const userPurchases = allPurchases.filter(p => p.buyerId === currentUser.id);
    setPurchases(userPurchases.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)));
  };

  const handleDownload = (purchase) => {
    if (purchase.downloadUrl) {
      const link = document.createElement('a');
      link.href = purchase.downloadUrl;
      link.download = purchase.productFile?.name || `${purchase.productTitle}.zip`;
      link.click();

      // Update download count
      const updatedPurchases = purchases.map(p => {
        if (p.id === purchase.id) {
          return { ...p, downloadCount: (p.downloadCount || 0) + 1 };
        }
        return p;
      });
      localStorage.setItem(SHOP_PURCHASES_KEY, JSON.stringify(updatedPurchases));
      setPurchases(updatedPurchases);
    } else {
      alert('Download link expired. Please contact the seller.');
    }
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Please login to view your purchases</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A6B8A', mb: 4 }}>
          📦 My Purchases ({purchases.length})
        </Typography>

        {purchases.length === 0 ? (
          <Paper sx={{ textAlign: 'center', py: 8, borderRadius: '24px' }}>
            <StoreIcon sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No purchases yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start shopping at the CreartsI Shop!
            </Typography>
            <Button
              variant="contained"
              href="/shop"
              sx={{ bgcolor: '#4A9FBF', borderRadius: '30px' }}
            >
              Browse Shop
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {purchases.map((purchase) => (
              <Grid item xs={12} key={purchase.id}>
                <Card sx={{ borderRadius: '20px', overflow: 'hidden' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                      <Box flex={1}>
                        <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap" mb={1}>
                          <Typography variant="h6" fontWeight={800} color="#1A6B8A">
                            {purchase.productTitle}
                          </Typography>
                          <Chip
                            label="Purchased"
                            size="small"
                            icon={<CheckCircleIcon />}
                            sx={{ bgcolor: '#10B981', color: 'white' }}
                          />
                        </Stack>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          From: {purchase.artistName}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Purchased on: {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </Typography>

                        <Typography variant="h6" fontWeight={800} sx={{ color: '#1A6B8A', mt: 1 }}>
                          Rp {purchase.productPrice?.toLocaleString('id-ID')}
                        </Typography>

                        {purchase.downloadCount > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            Downloaded {purchase.downloadCount} time(s)
                          </Typography>
                        )}
                      </Box>

                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(purchase)}
                        sx={{
                          bgcolor: '#4A9FBF',
                          borderRadius: '30px',
                          textTransform: 'none',
                          px: 4,
                          py: 1.5,
                          '&:hover': { bgcolor: '#1A6B8A' }
                        }}
                      >
                        Download Now
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default MyPurchasesPage;