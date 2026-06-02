// src/components/MyPurchasesPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StoreIcon from '@mui/icons-material/Store';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ChatIcon from '@mui/icons-material/Chat';
import { getUserTransactions } from '../services/PaymentService';
import toast from 'react-hot-toast';

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
    
    // Listen untuk storage changes untuk auto-refresh
    const handleStorageChange = () => {
      console.log('Storage changed, reloading purchases...');
      setTimeout(() => loadData(), 100);
    };
    
    const handleTransactionUpdate = () => {
      console.log('Transaction updated, reloading purchases...');
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('transactionUpdated', handleTransactionUpdate);
    window.addEventListener('commissionRequestUpdated', handleTransactionUpdate);
    
    // REMOVED: Auto-refresh interval - causing infinite loop
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('transactionUpdated', handleTransactionUpdate);
      window.removeEventListener('commissionRequestUpdated', handleTransactionUpdate);
    };
  }, [currentUser, navigate]);

  const loadData = () => {
    // 1. Load completed purchases dari shop (sudah diverifikasi)
    const allPurchases = JSON.parse(localStorage.getItem(SHOP_PURCHASES_KEY) || '[]');
    const userPurchases = allPurchases.filter(p => p.buyerId === currentUser.id);
    
    // Match cover image from products
    const allProducts = JSON.parse(localStorage.getItem('creartsi_shop_products') || '[]');
    const userPurchasesWithImage = userPurchases.map(p => {
      const prod = allProducts.find(prodItem => prodItem.id === p.productId);
      return { ...p, coverImage: prod ? prod.coverImage : null };
    });
    setPurchases(userPurchasesWithImage.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)));

    // 2. Load transactions from payment system (shop + commissions)
    const userTransactions = getUserTransactions(currentUser.id);
    
    // 3. TAMBAHAN: Load commission requests sebagai transactions juga
    const commissionRequests = JSON.parse(localStorage.getItem('commission_requests') || '[]');
    const userCommissionRequests = commissionRequests.filter(r => 
      String(r.buyerId) === String(currentUser.id)
    );
    
    // Convert commission requests to transaction format
    const commissionTransactions = userCommissionRequests.map(req => {
      // Cari commission data untuk ambil cover image
      const allCommissions = JSON.parse(localStorage.getItem('creartsi_artist_commissions') || '[]');
      const commission = allCommissions.find(c => c.id === req.commissionId);
      
      return {
        id: `comm-${req.id}`,
        type: 'COMMISSION',
        transactionCode: `COMM-${req.id}`,
        productId: req.commissionId,
        productTitle: req.commissionTitle || 'Commission Request',
        productPrice: req.commissionPrice || 0,
        artistId: req.artistId,
        artistName: req.artistName,
        buyerId: req.buyerId,
        requestId: req.id,
        status: req.paymentStatus || (req.status === 'completed' ? 'paid' : 'waiting_payment'),
        coverImage: commission?.coverImage || null,
        createdAt: req.createdAt,
        updatedAt: req.updatedAt || req.createdAt,
        productFile: null // Commission tidak ada file download langsung
      };
    });
    
    // Gabungkan shop transactions + commission transactions
    const allTransactionsWithImage = [...userTransactions, ...commissionTransactions].map(t => {
      if (t.type === 'COMMISSION') return t; // Commission sudah ada coverImage
      
      const prod = allProducts.find(prodItem => prodItem.id === t.productId);
      return { ...t, coverImage: t.productCoverImage || (prod ? prod.coverImage : null) };
    });
    
    setTransactions(allTransactionsWithImage.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
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
      toast.error('Download link expired. Please contact the seller.');
    }
  };

  const handlePay = (transaction) => {
    console.log('💰 PAY NOW CLICKED! Transaction:', transaction.id, transaction.type);
    
    // Jika ini commission transaction
    if (transaction.type === 'COMMISSION' && transaction.requestId) {
      const commRequests = JSON.parse(localStorage.getItem('commission_requests') || '[]');
      const updatedRequests = commRequests.map(r => {
        if (String(r.id) === String(transaction.requestId)) {
          console.log('Updating commission request:', r.id, 'to paid');
          return { ...r, paymentStatus: 'paid', status: 'accepted', updatedAt: new Date().toISOString() };
        }
        return r;
      });
      localStorage.setItem('commission_requests', JSON.stringify(updatedRequests));
      window.dispatchEvent(new CustomEvent('commissionRequestUpdated'));
    } else {
      // Ini shop transaction biasa
      const allTransactions = JSON.parse(localStorage.getItem('creartsi_transactions') || '[]');
      const updatedTransactions = allTransactions.map(t => {
        if (String(t.id) === String(transaction.id)) {
          console.log('Updating shop transaction:', t.id, 'to paid');
          return {
            ...t,
            status: 'paid',
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      });
      localStorage.setItem('creartsi_transactions', JSON.stringify(updatedTransactions));
    }
    
    // Trigger events
    window.dispatchEvent(new CustomEvent('transactionUpdated'));
    window.dispatchEvent(new Event('storage'));
    
    // Show success message
    toast.success('Payment successful! Your order is now confirmed.');
    
    // Force reload data after short delay
    setTimeout(() => {
      loadData();
      // Auto-switch to "Paid & Ready" tab
      setActiveTab(2);
    }, 300);
  };

  const handleDownloadFromTransaction = (transaction) => {
    console.log('⬇️ DOWNLOAD CLICKED! Transaction:', transaction.id, transaction.type);
    
    // Jika ini commission, tidak bisa download langsung (harus chat dengan artist)
    if (transaction.type === 'COMMISSION') {
      toast.error('Commission files are delivered by the artist. Please check your messages.');
      navigate('/messages');
      return;
    }
    
    // Untuk shop products
    if (transaction.productFile?.base64) {
      const link = document.createElement('a');
      link.href = transaction.productFile.base64;
      link.download = transaction.productFile.name || `${transaction.productTitle}.zip`;
      link.click();
      toast.success('Download started!');
    } else {
      toast.error('File not available. Please contact the seller.');
    }
  };

  const getStatusChip = (status) => {
    let bgcolor = '#F1F5F9';
    let color = '#475569';
    let border = '1px solid #E2E8F0';
    let label = status;
    let icon = null;

    if (status === 'waiting_payment') {
      bgcolor = '#FEF3C7';
      color = '#D97706';
      border = '1px solid #FCD34D';
      label = 'Waiting Payment';
      icon = <PaymentIcon style={{ fontSize: '14px', color: '#D97706' }} />;
    } else if (status === 'pending_verification') {
      bgcolor = '#E0F2FE';
      color = '#0284C7';
      border = '1px solid #BAE6FD';
      label = 'Pending Verification';
      icon = <PaymentIcon style={{ fontSize: '14px', color: '#0284C7' }} />;
    } else if (status === 'paid') {
      bgcolor = '#D1FAE5';
      color = '#059669';
      border = '1px solid #A7F3D0';
      label = 'Paid & Ready';
      icon = <CheckCircleIcon style={{ fontSize: '14px', color: '#059669' }} />;
    } else if (status === 'rejected') {
      bgcolor = '#FEE2E2';
      color = '#DC2626';
      border = '1px solid #FCA5A5';
      label = 'Payment Rejected';
    }

    return (
      <Chip
        label={label}
        size="small"
        icon={icon}
        sx={{
          bgcolor,
          color,
          border,
          fontWeight: 700,
          borderRadius: '8px',
          fontSize: '11px',
          px: 0.5,
          '& .MuiChip-icon': { color: 'inherit' }
        }}
      />
    );
  };

  const EmptyState = ({ icon: Icon, title, description, showButton = false }) => (
    <Paper
      sx={{
        textAlign: 'center',
        py: 8,
        px: 4,
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 10px 30px rgba(74, 159, 191, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'rgba(74, 159, 191, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          animation: 'pulse 2s infinite ease-in-out',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(74, 159, 191, 0.4)' },
            '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(74, 159, 191, 0)' },
            '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(74, 159, 191, 0)' }
          }
        }}
      >
        <Icon sx={{ fontSize: 40, color: '#4A9FBF' }} />
      </Box>
      <Typography variant="h6" fontWeight={700} color="#1A6B8A" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: showButton ? 4 : 0, maxWidth: '320px' }}>
        {description}
      </Typography>
      {showButton && (
        <Button
          variant="contained"
          onClick={() => navigate('/shop')}
          sx={{
            background: 'linear-gradient(135deg, #4A9FBF 0%, #1A6B8A 100%)',
            borderRadius: '30px',
            textTransform: 'none',
            fontWeight: 700,
            px: 4,
            py: 1.5,
            boxShadow: '0 4px 15px rgba(74, 159, 191, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(74, 159, 191, 0.4)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Browse Shop
        </Button>
      )}
    </Paper>
  );

  const PurchaseCard = ({ title, code, artist, date, price, status, onAction, actionLabel, actionIcon: ActionIcon, actionColor, coverImage, expiryText, isExpired }) => {
    // Removed excessive logging
    
    return (
    <Card
      sx={{
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 30px rgba(74, 159, 191, 0.04)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'visible',
        pointerEvents: 'auto',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(74, 159, 191, 0.1)'
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'stretch', sm: 'center' }}>
          {/* Thumbnail Image */}
          <Box
            sx={{
              width: { xs: '100%', sm: 110 },
              height: 110,
              borderRadius: '16px',
              overflow: 'hidden',
              bgcolor: '#E0F2FE',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              background: coverImage ? `url(${coverImage}) center/cover no-repeat` : 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)'
            }}
          >
            {!coverImage && <ShoppingBagIcon sx={{ fontSize: 40, color: '#4A9FBF' }} />}
          </Box>

          {/* Details */}
          <Box flex={1}>
            <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap" mb={1}>
              {code && (
                <Chip
                  label={code}
                  size="small"
                  icon={<ReceiptLongIcon style={{ fontSize: '14px', color: '#1A6B8A' }} />}
                  sx={{
                    bgcolor: '#E0F2FE',
                    color: '#1A6B8A',
                    fontWeight: 700,
                    borderRadius: '8px',
                    fontSize: '11px',
                    px: 0.5,
                    border: '1px solid #BAE6FD',
                    '& .MuiChip-icon': { color: '#1A6B8A' }
                  }}
                />
              )}
              {status && getStatusChip(status)}
            </Stack>

            <Typography variant="h6" fontWeight={800} color="#1A6B8A" sx={{ lineHeight: 1.3, mb: 1 }}>
              {title}
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2.5 }} sx={{ mb: 1.5 }}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <PersonIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Artist: <span style={{ color: '#475569', fontWeight: 600 }}>{artist}</span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <CalendarMonthIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Date: <span style={{ color: '#475569', fontWeight: 600 }}>{date}</span>
                </Typography>
              </Box>
            </Stack>

            <Typography variant="h5" fontWeight={850} color="#1A6B8A">
              Rp {price?.toLocaleString('id-ID')}
            </Typography>
            
            {expiryText && (
              <Typography variant="caption" color={isExpired ? "error" : "text.secondary"} sx={{ display: 'block', mt: 1, fontWeight: 600 }}>
                {expiryText}
              </Typography>
            )}
          </Box>

          {/* Action Button - ALWAYS SHOW, DISABLE IF NO ACTION */}
          <Button
            variant="contained"
            startIcon={<ActionIcon />}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('🔥 BUTTON CLICKED!', { actionLabel, hasAction: !!onAction });
              if (onAction) {
                console.log('✅ Calling onAction function...');
                onAction();
              } else {
                console.log('❌ No onAction function available');
              }
            }}
            disabled={!onAction}
            sx={{
              background: actionColor || 'linear-gradient(135deg, #4A9FBF 0%, #1A6B8A 100%)',
              borderRadius: '30px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '14px',
              px: 3.5,
              py: 1.5,
              minWidth: '140px',
              boxShadow: '0 4px 15px rgba(74, 159, 191, 0.2)',
              transition: 'all 0.3s ease',
              pointerEvents: 'auto !important',
              zIndex: 999,
              position: 'relative',
              cursor: onAction ? 'pointer !important' : 'not-allowed',
              opacity: onAction ? 1 : 0.6,
              '&:hover': {
                boxShadow: onAction ? '0 6px 20px rgba(74, 159, 191, 0.3)' : '0 4px 15px rgba(74, 159, 191, 0.2)',
                transform: onAction ? 'translateY(-2px)' : 'none',
                filter: onAction ? 'brightness(1.05)' : 'none'
              },
              '&:disabled': {
                opacity: 0.6,
                cursor: 'not-allowed'
              }
            }}
          >
            {actionLabel}
          </Button>
        </Stack>
      </CardContent>
    </Card>
    );
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: 6 }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #4A9FBF 0%, #1A6B8A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(74, 159, 191, 0.2)'
            }}
          >
            <ShoppingBagIcon sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1A6B8A', tracking: '-0.5px' }}>
              My Purchases
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Manage and download your purchased digital products and active transactions
            </Typography>
          </Box>
        </Box>

        {/* Custom Tabs Navigation */}
        <Paper
          sx={{
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
            overflow: 'hidden',
            p: 0.5,
            mb: 4
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newVal) => setActiveTab(newVal)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: '13px', sm: '15px' },
                borderRadius: '20px',
                transition: 'all 0.2s',
                py: 2,
                color: '#64748B',
                '&:hover': {
                  color: '#4A9FBF',
                  bgcolor: 'rgba(74, 159, 191, 0.05)'
                }
              },
              '& .Mui-selected': {
                color: '#1A6B8A !important',
                bgcolor: 'rgba(74, 159, 191, 0.1)'
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            <Tab label={`✅ Completed (${completedPurchases.length})`} />
            <Tab label={`⏳ Pending Payment (${pendingTransactions.length})`} />
            <Tab label={`💰 Paid & Ready (${paidTransactions.length})`} />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box sx={{ mt: 2 }}>
          {/* Tab 0: Completed Purchases */}
          {activeTab === 0 && (
            <Stack spacing={2.5}>
              {completedPurchases.length === 0 ? (
                <EmptyState
                  icon={StoreIcon}
                  title="No purchases yet"
                  description="Start shopping at the CreartsI Shop to see your orders here!"
                  showButton={true}
                />
              ) : (
                completedPurchases.map((purchase) => (
                  <PurchaseCard
                    key={purchase.id}
                    title={purchase.productTitle}
                    artist={purchase.artistName}
                    date={new Date(purchase.purchaseDate).toLocaleDateString()}
                    price={purchase.productPrice}
                    onAction={() => handleDownload(purchase)}
                    actionLabel="Download Now"
                    actionIcon={DownloadIcon}
                    coverImage={purchase.coverImage}
                  />
                ))
              )}
            </Stack>
          )}

          {/* Tab 1: Pending Payment */}
          {activeTab === 1 && (
            <Stack spacing={2.5}>
              {pendingTransactions.length === 0 ? (
                <EmptyState
                  icon={PaymentIcon}
                  title="No pending payments"
                  description="All your transactions have been settled. Thank you for shopping!"
                />
              ) : (
                pendingTransactions.map((tx) => {
                  // Removed excessive logging
                  const isExpired = tx.status === 'waiting_payment' && tx.expireAt && new Date(tx.expireAt) <= new Date();
                  const canPay = tx.status === 'waiting_payment' && !isExpired;
                  
                  let expiryText = '';
                  if (tx.status === 'waiting_payment') {
                    if (isExpired) {
                      expiryText = 'Payment expired';
                    } else if (tx.expireAt) {
                      expiryText = `Pay before: ${new Date(tx.expireAt).toLocaleString()}`;
                    }
                  }
                  return (
                    <PurchaseCard
                      key={tx.id}
                      title={tx.productTitle}
                      code={tx.transactionCode}
                      artist={tx.artistName}
                      date={new Date(tx.createdAt).toLocaleDateString()}
                      price={tx.productPrice}
                      status={tx.status}
                      onAction={canPay ? () => handlePay(tx) : null}
                      actionLabel="Pay Now"
                      actionIcon={PaymentIcon}
                      actionColor="linear-gradient(135deg, #10B981 0%, #059669 100%)"
                      coverImage={tx.coverImage}
                      expiryText={expiryText}
                      isExpired={isExpired}
                    />
                  );
                })
              )}
            </Stack>
          )}

          {/* Tab 2: Paid & Ready */}
          {activeTab === 2 && (
            <Stack spacing={2.5}>
              {paidTransactions.length === 0 ? (
                <EmptyState
                  icon={DownloadIcon}
                  title="No paid items ready"
                  description="Your purchased digital products will appear here ready to download instantly!"
                />
              ) : (
                paidTransactions.map((tx) => {
                  // Untuk commission, tampilkan info bahwa file dikirim via chat
                  // Untuk shop, tampilkan tombol download
                  const isCommission = tx.type === 'COMMISSION';
                  
                  return (
                    <PurchaseCard
                      key={tx.id}
                      title={tx.productTitle}
                      code={tx.transactionCode}
                      artist={tx.artistName}
                      date={new Date(tx.updatedAt || tx.createdAt).toLocaleDateString()}
                      price={tx.productPrice}
                      status={tx.status}
                      onAction={isCommission ? () => navigate('/messages') : () => handleDownloadFromTransaction(tx)}
                      actionLabel={isCommission ? 'Open Messages' : 'Download Now'}
                      actionIcon={isCommission ? CheckCircleIcon : DownloadIcon}
                      actionColor={isCommission ? 'linear-gradient(135deg, #4A9FBF 0%, #1A6B8A 100%)' : undefined}
                      coverImage={tx.coverImage}
                    />
                  );
                })
              )}
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default MyPurchasesPage;