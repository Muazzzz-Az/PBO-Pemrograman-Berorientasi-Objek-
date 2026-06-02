// src/components/artist/MyCommissions.js
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, Button,
  Chip, Stack, Divider, Avatar, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import BuildIcon from '@mui/icons-material/Build';
import DoneIcon from '@mui/icons-material/Done';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';

function MyCommissions() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');

  const loadRequests = () => {
    if (!currentUser) return;

    // Ambil semua commission requests
    const commissionRequests = JSON.parse(localStorage.getItem('commission_requests') || '[]');
    const purchaseRequests = JSON.parse(localStorage.getItem('purchase_requests') || '[]');

    console.log('All commission requests:', commissionRequests);
    console.log('Current artist ID:', currentUser.id);

    // Filter untuk artist yang login (case sensitive, pastikan ID match)
    const myCommissionRequests = commissionRequests.filter(r => {
      const match = Number(r.artistId) === Number(currentUser.id);
      if (match) console.log('Found request for artist:', r);
      return match;
    });

    const myPurchaseRequests = purchaseRequests.filter(r => Number(r.artistId) === Number(currentUser.id));

    const allRequests = [...myCommissionRequests, ...myPurchaseRequests];
    allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setRequests(allRequests);
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadRequests();

    // Listen untuk update real-time
    const handleUpdate = () => loadRequests();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('commissionRequestUpdated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('commissionRequestUpdated', handleUpdate);
    };
  }, [currentUser, navigate]);

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
      case 'accepted':
        return <Chip icon={<CheckCircleIcon />} label="Accepted" color="info" size="small" />;
      case 'ongoing':
        return <Chip icon={<BuildIcon />} label="Ongoing" color="primary" size="small" />;
      case 'completed':
        return <Chip icon={<DoneIcon />} label="Completed" color="success" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const handleUpdateStatus = (request, newStatus) => {
    setSelectedRequest(request);
    setStatusUpdate(newStatus);
    setOpenDialog(true);
  };

  const confirmUpdate = () => {
    // Update commission_requests
    const commissionRequests = JSON.parse(localStorage.getItem('commission_requests') || '[]');
    const updatedCommission = commissionRequests.map(r => {
      if (r.id === selectedRequest.id) {
        return { ...r, status: statusUpdate, updatedAt: new Date().toISOString() };
      }
      return r;
    });
    localStorage.setItem('commission_requests', JSON.stringify(updatedCommission));

    // Update purchase_requests jika ada
    const purchaseRequests = JSON.parse(localStorage.getItem('purchase_requests') || '[]');
    const updatedPurchase = purchaseRequests.map(r => {
      if (r.id === selectedRequest.id) {
        return { ...r, status: statusUpdate, updatedAt: new Date().toISOString() };
      }
      return r;
    });
    localStorage.setItem('purchase_requests', JSON.stringify(updatedPurchase));

    // Update state
    setRequests(prev => prev.map(r =>
      r.id === selectedRequest.id ? { ...r, status: statusUpdate } : r
    ));

    setOpenDialog(false);

    // Notifikasi ke buyer
    if (statusUpdate === 'accepted') {
      const buyerNotifKey = `user_notifications_${selectedRequest.buyerId}`;
      const buyerNotifs = JSON.parse(localStorage.getItem(buyerNotifKey) || '[]');
      buyerNotifs.unshift({
        id: Date.now(),
        message: `🎉 Your request for "${selectedRequest.commissionTitle || selectedRequest.productTitle}" has been accepted! You can now chat with the artist.`,
        type: 'REQUEST_ACCEPTED',
        isRead: false,
        timestamp: new Date().toLocaleTimeString()
      });
      localStorage.setItem(buyerNotifKey, JSON.stringify(buyerNotifs));
    }

    // Trigger event untuk update
    window.dispatchEvent(new Event('storage'));
    alert(`Request ${statusUpdate} successfully!`);
  };

  const handleChat = (request) => {
    navigate(`/messages?userId=${request.buyerId}&requestId=${request.id}`);
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending Review' },
    { value: 'accepted', label: 'Accept & Start Chat' },
    { value: 'ongoing', label: 'Mark as Ongoing' },
    { value: 'completed', label: 'Mark as Completed' },
    { value: 'rejected', label: 'Reject' }
  ];

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const activeCount = requests.filter(r => r.status === 'accepted' || r.status === 'ongoing').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A6B8A', mb: 4 }}>
          📋 My Commissions
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: '16px', bgcolor: '#FEF3C7' }}>
              <CardContent>
                <Typography variant="h3" fontWeight={800} color="#D97706">{pendingCount}</Typography>
                <Typography variant="caption">Pending Requests</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: '16px', bgcolor: '#E0F2FE' }}>
              <CardContent>
                <Typography variant="h3" fontWeight={800} color="#0284C7">{activeCount}</Typography>
                <Typography variant="caption">Active Commissions</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: '16px', bgcolor: '#D1FAE5' }}>
              <CardContent>
                <Typography variant="h3" fontWeight={800} color="#059669">{completedCount}</Typography>
                <Typography variant="caption">Completed</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Requests List */}
        {requests.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8, borderRadius: '24px' }}>
            <Typography variant="h6" color="text.secondary">No commission requests yet</Typography>
            <Typography variant="body2" color="text.secondary">When buyers request your work, they'll appear here</Typography>
          </Card>
        ) : (
          requests.map((req) => (
            <Card key={req.id} sx={{ borderRadius: '20px', overflow: 'hidden', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                  <Box>
                    <Typography variant="caption" color="#4A9FBF" fontWeight={600}>
                      {req.type === 'SHOP_REQUEST' ? '🛍️ Shop Request' : '🎨 Commission Request'}
                    </Typography>
                    <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5 }}>
                      {req.commissionTitle || req.productTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      From: {req.buyerName} (@{req.buyerUsername})
                    </Typography>
                    <Typography variant="h6" fontWeight={800} color="#1A6B8A" sx={{ mt: 1 }}>
                      Rp {(req.commissionPrice || req.productPrice)?.toLocaleString('id-ID')}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    {getStatusChip(req.status)}
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Request Details */}
                {req.references && (
                  <Typography variant="body2" sx={{ mb: 2, bgcolor: '#F8FAFC', p: 2, borderRadius: 2 }}>
                    <strong>References:</strong> {req.references}
                  </Typography>
                )}

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  {req.status === 'pending' && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleUpdateStatus(req, 'accepted')}
                        sx={{ borderRadius: '30px', textTransform: 'none' }}
                      >
                        Accept Request
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleUpdateStatus(req, 'rejected')}
                        sx={{ borderRadius: '30px', textTransform: 'none' }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {req.status === 'accepted' && (
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateStatus(req, 'ongoing')}
                      sx={{ bgcolor: '#3B82F6', borderRadius: '30px', textTransform: 'none' }}
                    >
                      Start Working
                    </Button>
                  )}
                  {req.status === 'ongoing' && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdateStatus(req, 'completed')}
                      sx={{ borderRadius: '30px', textTransform: 'none' }}
                    >
                      Mark as Completed
                    </Button>
                  )}
                  {(req.status === 'accepted' || req.status === 'ongoing') && (
                    <Button
                      variant="outlined"
                      startIcon={<ChatIcon />}
                      onClick={() => handleChat(req)}
                      sx={{ borderRadius: '30px', textTransform: 'none', borderColor: '#4A9FBF', color: '#4A9FBF' }}
                    >
                      Chat with Buyer
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Container>

      {/* Update Status Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Request Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Change status for "{selectedRequest?.commissionTitle || selectedRequest?.productTitle}"
          </Typography>
          <TextField
            select
            fullWidth
            value={statusUpdate}
            onChange={(e) => setStatusUpdate(e.target.value)}
            sx={{ mt: 2 }}
          >
            {statusOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmUpdate} variant="contained" sx={{ bgcolor: '#4A9FBF' }}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyCommissions;