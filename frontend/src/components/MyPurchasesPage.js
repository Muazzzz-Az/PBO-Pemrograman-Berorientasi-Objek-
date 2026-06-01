// src/components/MyPurchasesPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Stack,
  Divider,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StoreIcon from '@mui/icons-material/Store';
import PaymentIcon from '@mui/icons-material/Payment';
import { getUserTransactions } from '../services/PaymentService';

const SHOP_PURCHASES_KEY = 'creartsi_shop_purchases';

function MyPurchasesPage() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadData();
  }, [currentUser, navigate]);

  const loadData = () => {
    // Load completed purchases (sudah diverifikasi)
    const allPurchases = JSON.parse(localStorage.getItem(SHOP_PURCHASES_KEY) || '[]');
    const userPurchases = allPurchases.filter(p => p.buyerId === currentUser.id);
    setPurchases(userPurchases.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)));

    // Load transactions from payment system
    const userTransactions = getUserTransactions(currentUser.id);
    setTransactions(userTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleDownload = (purchase) => {
    if (purchase.downloadUrl) {
      const link = document.createElement('a');
      link.href = purchase.downloadUrl;
      link.download = purchase.productFile?.name || `${purchase.productTitle}.zip`;
      link.click();

      // Update download count
      const allPurchases = JSON.parse(localStorage.getItem(SHOP_PURCHASES_KEY) || '[]');
      const updatedPurchases = allPurchases.map(p => {
        if (p.id === purchase.id) {
          return { ...p, downloadCount: (p.downloadCount || 0) + 1 };
        }
        return p;
      });
      localStorage.setItem(SHOP_PURCHASES_KEY, JSON.stringify(updatedPurchases));
      loadData();
    } else {
      alert('Download link expired. Please contact the seller.');
    }
  };

  const handleDownloadFromTransaction = (transaction) => {
    if (transaction.productFile?.base64) {
      const link = document.createElement('a');
      link.href = transaction.productFile.base64;
      link.download = transaction.productFile.name || `${transaction.productTitle}.zip`;
      link.click();
    } else {
      alert('File not available. Please contact the seller.');
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'waiting_payment':
        return <Chip label="Waiting Payment" size="small" color="warning" icon={<PaymentIcon />} />;
      case 'pending_verification':
        return <Chip label="Pending Verification" size="small" color="info" />;
      case 'paid':
        return <Chip label="✓ Paid & Ready" size="small" color="success" icon={<CheckCircleIcon />} />;
      case 'rejected':
        return <Chip label="Payment Rejected" size="small" color="error" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Please login to view your purchases</Typography>
      </Container>
    );
  }

  const completedPurchases = purchases;
  const pendingTransactions = transactions.filter(t => t.status !== 'paid');
  const paidTransactions = transactions.filter(t => t.status === 'paid');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A6B8A', mb: 4 }}>
          📦 My Purchases
        </Typography>

        <Paper sx={{ borderRadius: '16px', overflow: 'hidden', mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newVal) => setActiveTab(newVal)}
            sx={{
              borderBottom: '1px solid #E2E8F0',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
              '& .Mui-selected': { color: '#4A9FBF' },
              '& .MuiTabs-indicator': { bgcolor: '#4A9FBF' }
            }}
          >
            <Tab label={`✅ Completed (${completedPurchases.length})`} />
            <Tab label={`⏳ Pending Payment (${pendingTransactions.length})`} />
            <Tab label={`💰 Paid & Ready (${paidTransactions.length})`} />
          </Tabs>
        </Paper>

        {/* Tab 0: Completed Purchases */}
        {activeTab === 0 && (
          <>
            {completedPurchases.length === 0 ? (
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
                {completedPurchases.map((purchase) => (
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
                                label="Completed"
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
          </>
        )}

        {/* Tab 1: Pending Payment */}
        {activeTab === 1 && (
          <>
            {pendingTransactions.length === 0 ? (
              <Paper sx={{ textAlign: 'center', py: 8, borderRadius: '24px' }}>
                <PaymentIcon sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">No pending payments</Typography>
                <Typography variant="body2" color="text.secondary">
                  All your transactions are complete
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {pendingTransactions.map((tx) => (
                  <Grid item xs={12} key={tx.id}>
                    <Card sx={{ borderRadius: '20px', overflow: 'hidden' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                          <Box flex={1}>
                            <Typography variant="caption" color="#4A9FBF" fontWeight={600}>
                              {tx.transactionCode}
                            </Typography>
                            <Typography variant="h6" fontWeight={800} color="#1A6B8A" sx={{ mt: 0.5 }}>
                              {tx.productTitle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Seller: {tx.artistName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Order date: {new Date(tx.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1A6B8A', mt: 1 }}>
                              Rp {tx.productPrice?.toLocaleString('id-ID')}
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            {getStatusChip(tx.status)}
                            {tx.expireAt && new Date(tx.expireAt) > new Date() ? (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                Pay before: {new Date(tx.expireAt).toLocaleString()}
                              </Typography>
                            ) : tx.status === 'waiting_payment' && (
                              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                Payment expired
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Tab 2: Paid & Ready */}
        {activeTab === 2 && (
          <>
            {paidTransactions.length === 0 ? (
              <Paper sx={{ textAlign: 'center', py: 8, borderRadius: '24px' }}>
                                <DownloadIcon sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">No paid items ready</Typography>
                <Typography variant="body2" color="text.secondary">
                  Your paid items will appear here
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {paidTransactions.map((tx) => (
                  <Grid item xs={12} key={tx.id}>
                    <Card sx={{ borderRadius: '20px', overflow: 'hidden' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                          <Box flex={1}>
                            <Typography variant="caption" color="#4A9FBF" fontWeight={600}>
                              {tx.transactionCode}
                            </Typography>
                            <Typography variant="h6" fontWeight={800} color="#1A6B8A" sx={{ mt: 0.5 }}>
                              {tx.productTitle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              From: {tx.artistName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Paid on: {new Date(tx.updatedAt || tx.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#1A6B8A', mt: 1 }}>
                              Rp {tx.productPrice?.toLocaleString('id-ID')}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownloadFromTransaction(tx)}
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
          </>
        )}
      </Container>
    </Box>
  );
}

export default MyPurchasesPage;