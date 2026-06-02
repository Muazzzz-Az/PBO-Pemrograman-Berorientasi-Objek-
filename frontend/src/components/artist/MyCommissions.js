// src/components/artist/MyCommissions.js
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, Button,
  Chip, Stack, Divider, Avatar, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Tooltip, IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import BuildIcon from '@mui/icons-material/Build';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ChatIcon from '@mui/icons-material/Chat';
import BrushIcon from '@mui/icons-material/Brush';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────
const STATUS = {
  pending: {
    label: 'New Request', color: '#F59E0B', bg: '#FFFBEB',
    border: '#FDE68A', text: '#92400E',
    icon: <PendingIcon sx={{ fontSize: 14 }} />,
    desc: 'New request. Review details and accept or reject.',
  },
  accepted: {
    label: 'Accepted', color: '#3B82F6', bg: '#EFF6FF',
    border: '#BFDBFE', text: '#1E40AF',
    icon: <CheckCircleIcon sx={{ fontSize: 14 }} />,
    desc: 'Accepted! You can chat with the buyer to discuss details.',
  },
  ongoing: {
    label: 'In Progress', color: '#8B5CF6', bg: '#F5F3FF',
    border: '#DDD6FE', text: '#5B21B6',
    icon: <BuildIcon sx={{ fontSize: 14 }} />,
    desc: 'You are currently working on this commission.',
  },
  completed: {
    label: 'Completed', color: '#10B981', bg: '#ECFDF5',
    border: '#A7F3D0', text: '#065F46',
    icon: <DoneAllIcon sx={{ fontSize: 14 }} />,
    desc: 'This commission is completed and delivered! 🎉',
  },
  rejected: {
    label: 'Declined', color: '#EF4444', bg: '#FEF2F2',
    border: '#FECACA', text: '#991B1B', icon: null,
    desc: 'This request was declined.',
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.pending;
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.5,
      px: 1.5, py: 0.5, borderRadius: '20px',
      bgcolor: cfg.bg, border: `1px solid ${cfg.border}`,
      color: cfg.text, fontWeight: 700, fontSize: '0.75rem',
      letterSpacing: '0.3px', whiteSpace: 'nowrap',
    }}>
      {cfg.icon}{cfg.label}
    </Box>
  );
};

const StatCard = ({ count, label, color, bg, icon }) => (
  <Card sx={{ borderRadius: '20px', bgcolor: bg, border: `1.5px solid ${color}22`, boxShadow: 'none', overflow: 'hidden' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color, lineHeight: 1 }}>{count}</Typography>
          <Typography variant="caption" sx={{ color, opacity: 0.75, fontWeight: 700, letterSpacing: '0.4px' }}>
            {label.toUpperCase()}
          </Typography>
        </Box>
        <Box sx={{ width: 44, height: 44, borderRadius: '14px', bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

function MyCommissions() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [requests, setRequests] = useState([]);

  // Fungsi load data yang lebih robust
  const loadRequests = () => {
    if (!currentUser) {
      console.log('No current user found');
      return;
    }

    console.log('Loading requests for artist ID:', currentUser.id);
    console.log('Artist username:', currentUser.username);

    // Ambil semua commission requests
    const commissionRequests = JSON.parse(localStorage.getItem('commission_requests') || '[]');
    const purchaseRequests = JSON.parse(localStorage.getItem('purchase_requests') || '[]');

    console.log('All commission requests found:', commissionRequests.length);
    console.log('All purchase requests found:', purchaseRequests.length);

    // Debug: log semua request untuk lihat artistId
    commissionRequests.forEach(req => {
      console.log(`Request: ${req.id}, artistId: ${req.artistId}, type: ${req.type}`);
    });

    // 🔥 PERBAIKAN: Filter untuk artist yang login (lebih fleksibel)
    const myCommissionRequests = commissionRequests.filter(r => {
      // Coba berbagai cara matching ID
      const artistIdMatch = Number(r.artistId) === Number(currentUser.id);
      const artistNameMatch = r.artistName === currentUser.fullName ||
                              r.artistName === currentUser.username;
      const match = artistIdMatch || artistNameMatch;

      if (match) {
        console.log('✓ Found matching commission request:', r.id, 'for', r.artistName);
      }
      return match;
    });

    const myPurchaseRequests = purchaseRequests.filter(r => {
      const match = Number(r.artistId) === Number(currentUser.id);
      if (match) console.log('✓ Found matching purchase request:', r.id);
      return match;
    });

    // Gabungkan semua request
    let allRequests = [...myCommissionRequests, ...myPurchaseRequests];

    // Tambahkan juga request dari product interests (chat requests)
    const productInterests = JSON.parse(localStorage.getItem('creartsi_product_interests') || '[]');
    const myInterests = productInterests.filter(i => Number(i.artistId) === Number(currentUser.id));

    if (myInterests.length > 0) {
      console.log('Found product interests:', myInterests.length);
      const interestRequests = myInterests.map(interest => ({
        id: interest.id,
        productId: interest.productId,
        type: 'INTEREST',
        commissionTitle: interest.productTitle,
        productTitle: interest.productTitle,
        buyerName: interest.buyerName,
        buyerUsername: interest.buyerUsername,
        buyerId: interest.buyerId,
        commissionPrice: interest.productPrice,
        status: interest.status || 'accepted', // Interest langsung bisa chat
        createdAt: interest.createdAt,
        references: 'Product interest - chat to negotiate',
        roomId: interest.roomId
      }));
      allRequests = [...allRequests, ...interestRequests];
    }
    
    // 🔥 TAMBAHAN: Juga ambil dari purchase_requests (shop requests yang masuk)
    const shopRequests = purchaseRequests.filter(r => {
      const match = Number(r.artistId) === Number(currentUser.id);
      if (match) console.log('✓ Found matching shop request:', r.id);
      return match;
    });
    
    if (shopRequests.length > 0) {
      console.log('Found shop requests:', shopRequests.length);
      const shopRequestMapped = shopRequests.map(req => ({
        ...req,
        type: req.type || 'SHOP_REQUEST',
        commissionTitle: req.productTitle,
        commissionPrice: req.productPrice
      }));
      allRequests = [...allRequests, ...shopRequestMapped];
    }

    // Sort by newest first
    allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log('Final filtered requests:', allRequests.length);
    setRequests(allRequests);
  };

  // Load data saat komponen mount dan setiap ada perubahan storage
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Load initial data
    loadRequests();

    // 🔥 PERBAIKAN: Event listener yang lebih agresif
    const handleStorageChange = (e) => {
      console.log('Storage changed:', e?.key);
      // Reload data untuk setiap perubahan storage
      setTimeout(() => loadRequests(), 100);
    };

    const handleCustomEvent = () => {
      console.log('Custom commission event triggered');
      loadRequests();
    };

    // Listen untuk berbagai event
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('commissionRequestUpdated', handleCustomEvent);
    window.addEventListener('commissionDataChanged', handleCustomEvent);

    // Interval fallback untuk real-time update (setiap 3 detik)
    const intervalId = setInterval(() => {
      loadRequests();
    }, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('commissionRequestUpdated', handleCustomEvent);
      window.removeEventListener('commissionDataChanged', handleCustomEvent);
      clearInterval(intervalId);
    };
  }, [currentUser, navigate]);

  const updateRequestStatus = (request, newStatus) => {
    if (!request) return;

    // Optional confirmation for rejecting/declining
    if (newStatus === 'rejected') {
      const confirmReject = window.confirm('Are you sure you want to decline this request?');
      if (!confirmReject) return;
    }

    // Update commission_requests
    const commissionRequests = JSON.parse(localStorage.getItem('commission_requests') || '[]');
    const updatedCommission = commissionRequests.map(r => {
      if (r.id === request.id) {
        return { ...r, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return r;
    });
    localStorage.setItem('commission_requests', JSON.stringify(updatedCommission));

    // Update purchase_requests jika ada
    const purchaseRequests = JSON.parse(localStorage.getItem('purchase_requests') || '[]');
    const updatedPurchase = purchaseRequests.map(r => {
      if (r.id === request.id) {
        return { ...r, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return r;
    });
    localStorage.setItem('purchase_requests', JSON.stringify(updatedPurchase));

    // Update creartsi_product_interests jika type nya INTEREST
    if (request.type === 'INTEREST') {
      const productInterests = JSON.parse(localStorage.getItem('creartsi_product_interests') || '[]');
      const updatedInterests = productInterests.map(i => {
        if (String(i.id) === String(request.id)) {
          return { ...i, status: newStatus };
        }
        return i;
      });
      localStorage.setItem('creartsi_product_interests', JSON.stringify(updatedInterests));

      // Jika artist menandai selesai (completed), kita otomatis update transaksi di creartsi_transactions menjadi 'paid'
      if (newStatus === 'completed') {
        const transactions = JSON.parse(localStorage.getItem('creartsi_transactions') || '[]');
        const updatedTransactions = transactions.map(t => {
          if (String(t.productId) === String(request.productId) && String(t.buyerId) === String(request.buyerId)) {
            return { ...t, status: 'paid', updatedAt: new Date().toISOString() };
          }
          return t;
        });
        localStorage.setItem('creartsi_transactions', JSON.stringify(updatedTransactions));
        window.dispatchEvent(new CustomEvent('transactionUpdated'));
      }
    }
    
    // 🔥 UPDATE: Jika type SHOP_REQUEST, update transactions juga
    if (request.type === 'SHOP_REQUEST' && newStatus === 'completed') {
      const transactions = JSON.parse(localStorage.getItem('creartsi_transactions') || '[]');
      const updatedTransactions = transactions.map(t => {
        if (String(t.productId) === String(request.productId) && String(t.buyerId) === String(request.buyerId)) {
          return { ...t, status: 'paid', updatedAt: new Date().toISOString() };
        }
        return t;
      });
      localStorage.setItem('creartsi_transactions', JSON.stringify(updatedTransactions));
      window.dispatchEvent(new CustomEvent('transactionUpdated'));
    }

    // Update state lokal
    setRequests(prev => prev.map(r =>
      r.id === request.id ? { ...r, status: newStatus } : r
    ));

    // Notifikasi ke buyer jika status accepted
    if (newStatus === 'accepted' && request.buyerId) {
      const buyerNotifKey = `user_notifications_${request.buyerId}`;
      const buyerNotifs = JSON.parse(localStorage.getItem(buyerNotifKey) || '[]');
      buyerNotifs.unshift({
        id: Date.now(),
        message: `🎉 Your request for "${request.commissionTitle || request.productTitle}" has been accepted! You can now chat with the artist.`,
        type: 'REQUEST_ACCEPTED',
        isRead: false,
        timestamp: new Date().toLocaleTimeString()
      });
      localStorage.setItem(buyerNotifKey, JSON.stringify(buyerNotifs));
    }

    // Trigger event untuk update di tab lain
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('commissionRequestUpdated'));

    toast.success(`Request ${newStatus === 'accepted' ? 'accepted' : newStatus === 'rejected' ? 'declined' : newStatus} successfully!`);
  };

  const handleChat = (request) => {
    // Gunakan buyerId atau roomId yang tersedia
    const targetUserId = request.buyerId || request.userId;
    if (targetUserId) {
      navigate(`/messages?userId=${targetUserId}&requestId=${request.id}`);
    } else {
      toast.error('Cannot start chat: buyer information missing');
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const activeCount = requests.filter(r => r.status === 'accepted' || r.status === 'ongoing').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;

  if (!currentUser) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: 4 }}>
        <Container maxWidth="lg">
          <Typography>Loading...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: 5 }}>
      <Container maxWidth="md">

        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ width: 44, height: 44, borderRadius: '14px', bgcolor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BrushIcon sx={{ color: '#0284C7', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={900} sx={{ color: '#1E293B', lineHeight: 1.1 }}>
                My Commissions
              </Typography>
              <Typography variant="caption" color="#64748B">Manage commission requests from your buyers</Typography>
            </Box>
          </Stack>

          <Tooltip title="Refresh" arrow>
            <IconButton onClick={loadRequests} sx={{
              bgcolor: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '14px',
              width: 42, height: 42, color: '#4A9FBF', transition: 'all 0.2s',
              '&:hover': { bgcolor: '#EFF6FF', borderColor: '#4A9FBF' },
            }}>
              <RefreshIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={4}>
            <StatCard count={pendingCount} label="Pending" color="#F59E0B" bg="#FFFBEB" icon={<PendingIcon />} />
          </Grid>
          <Grid item xs={4}>
            <StatCard count={activeCount} label="Active" color="#0284C7" bg="#E0F2FE" icon={<BuildIcon />} />
          </Grid>
          <Grid item xs={4}>
            <StatCard count={completedCount} label="Completed" color="#10B981" bg="#ECFDF5" icon={<DoneAllIcon />} />
          </Grid>
        </Grid>

        {/* Requests List */}
        {requests.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8, borderRadius: '24px', border: '1.5px dashed #CBD5E1', boxShadow: 'none', bgcolor: '#fff' }}>
            <Typography variant="h6" fontWeight={700} color="#94A3B8">No commission requests yet</Typography>
            <Typography variant="body2" color="#CBD5E1" sx={{ mt: 0.5 }}>When buyers request your work, they'll appear here</Typography>
          </Card>
        ) : (
          requests.map((req) => {
            const cfg = STATUS[req.status] || STATUS.pending;
            const buyerName = req.buyerName || 'Buyer';
            const dateStr = new Date(req.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            const price = (req.commissionPrice || req.productPrice || 0).toLocaleString('id-ID');

            return (
              <Card key={req.id} sx={{
                borderRadius: '20px', overflow: 'hidden', mb: 2.5,
                border: `1.5px solid ${cfg.border}`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': { boxShadow: '0 6px 24px rgba(74,159,191,0.12)', transform: 'translateY(-2px)' },
              }}>
                {/* top colored stripe */}
                <Box sx={{ height: 4, bgcolor: cfg.color }} />

                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                    <Box flex={1} minWidth={0}>
                      <Typography variant="caption" sx={{
                        color: cfg.color, fontWeight: 700, fontSize: '0.7rem',
                        textTransform: 'uppercase', letterSpacing: '0.6px',
                      }}>
                        {req.type === 'SHOP_REQUEST' ? '🛍️ Shop Request' :
                         req.type === 'INTEREST' ? '💬 Product Interest' : '🎨 Commission Request'}
                      </Typography>
                      <Typography variant="h6" fontWeight={800} sx={{
                        color: '#1E293B', lineHeight: 1.2, mt: 0.3,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {req.commissionTitle || req.productTitle || 'Untitled Request'}
                      </Typography>
                    </Box>
                    <Box textAlign="right" flexShrink={0}>
                      <StatusBadge status={req.status} />
                      <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#1A6B8A', mt: 0.8, fontSize: '1rem' }}>
                        Rp {price}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Buyer row */}
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{
                    mt: 2, p: 1.5, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0',
                  }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#1A6B8A', fontSize: '0.9rem', fontWeight: 700 }}>
                      {buyerName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight={700} color="#1E293B">{buyerName}</Typography>
                      <Typography variant="caption" color="#64748B">Buyer · Requested {dateStr}</Typography>
                    </Box>
                  </Stack>

                  {/* References */}
                  {req.references && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block', mb: 0.5 }}>
                        REFERENCES / DESCRIPTION
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                        {req.references}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

                  {/* Actions */}
                  <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" gap={1}>
                    {req.status === 'pending' && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => updateRequestStatus(req, 'accepted')}
                          sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
                        >
                          Accept Request
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => updateRequestStatus(req, 'rejected')}
                          sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600 }}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {req.status === 'accepted' && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => updateRequestStatus(req, 'ongoing')}
                        sx={{ bgcolor: '#3B82F6', borderRadius: '20px', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#1D4ED8' }, boxShadow: 'none' }}
                      >
                        Start Working
                      </Button>
                    )}

                    {req.status === 'ongoing' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => updateRequestStatus(req, 'completed')}
                        sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
                      >
                        Mark as Completed
                      </Button>
                    )}

                    {(req.status === 'accepted' || req.status === 'ongoing' || req.type === 'INTEREST' || req.type === 'SHOP_REQUEST') && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ChatIcon sx={{ fontSize: 15 }} />}
                        onClick={() => handleChat(req)}
                        sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600, borderColor: '#4A9FBF', color: '#4A9FBF', '&:hover': { borderColor: '#1A6B8A', bgcolor: 'rgba(74, 159, 191, 0.05)' } }}
                      >
                        Chat with Buyer
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })
        )}
      </Container>

      {/* No update dialog required, status updates directly */}
    </Box>
  );
}

export default MyCommissions;