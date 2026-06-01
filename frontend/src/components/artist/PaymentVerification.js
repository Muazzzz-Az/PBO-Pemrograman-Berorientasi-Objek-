// src/components/artist/PaymentVerification.js
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Avatar, Divider
} from '@mui/material';
import { getArtistTransactions, updateTransactionStatus } from '../../services/PaymentService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

const PaymentVerification = ({ artistId, artistName }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    loadTransactions();
    const handleUpdate = () => loadTransactions();
    window.addEventListener('transactionUpdated', handleUpdate);
    return () => window.removeEventListener('transactionUpdated', handleUpdate);
  }, [artistId]);

  const loadTransactions = () => {
    const allTransactions = getArtistTransactions(artistId);
    // Filter yang butuh verifikasi atau pending
    const pendingTransactions = allTransactions.filter(t =>
      t.status === 'pending_verification' || t.status === 'waiting_payment'
    );
    setTransactions(pendingTransactions);
  };

  const handleVerify = (transaction, status) => {
    const updated = updateTransactionStatus(transaction.id, status);

    // Notifikasi ke buyer
    const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
    notifications.unshift({
      id: Date.now(),
      message: status === 'paid'
        ? `✅ Payment for "${transaction.productTitle}" has been verified! You can now download your file.`
        : `❌ Payment verification failed for "${transaction.productTitle}". Please contact support.`,
      type: 'PAYMENT_VERIFIED',
      isRead: false,
      timestamp: new Date().toLocaleTimeString(),
      downloadUrl: status === 'paid' ? transaction.productFile?.base64 : null,
      transactionId: transaction.id
    });
    localStorage.setItem('user_notifications', JSON.stringify(notifications));

    window.dispatchEvent(new Event('storage'));
    loadTransactions();
    setOpenDialog(false);
    alert(`Payment ${status === 'paid' ? 'APPROVED' : 'REJECTED'}!`);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'waiting_payment': return <Chip label="Waiting Payment" size="small" color="warning" />;
      case 'pending_verification': return <Chip label="Pending Verification" size="small" color="info" />;
      case 'paid': return <Chip label="Paid" size="small" color="success" />;
      default: return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} color="#1A6B8A" sx={{ mb: 3 }}>
        💵 Payment Verification
      </Typography>

      {transactions.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: '16px' }}>
          <Typography variant="body1" color="text.secondary">No pending payments to verify</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {transactions.map((tx) => (
            <Grid item xs={12} key={tx.id}>
              <Card sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                    <Box>
                      <Typography variant="caption" color="#4A9FBF" fontWeight={600}>
                        {tx.transactionCode}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700}>{tx.productTitle}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Buyer: {tx.buyerName} ({tx.buyerEmail})
                      </Typography>
                      <Typography variant="h6" fontWeight={800} color="#1A6B8A" sx={{ mt: 1 }}>
                        Rp {tx.productPrice?.toLocaleString('id-ID')}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      {getStatusChip(tx.status)}
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => { setSelectedTransaction(tx); setOpenDialog(true); }}
                        sx={{ mt: 1, ml: 2 }}
                      >
                        View Proof
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog untuk lihat bukti pembayaran */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#4A9FBF', color: 'white' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={700}>Payment Proof</Typography>
            <IconButton onClick={() => setOpenDialog(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedTransaction && (
            <>
              <Typography variant="subtitle2" color="text.secondary">Transaction Code</Typography>
              <Typography variant="body1" fontWeight={700} sx={{ mb: 2 }}>{selectedTransaction.transactionCode}</Typography>

              <Typography variant="subtitle2" color="text.secondary">Product</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{selectedTransaction.productTitle}</Typography>

              <Typography variant="subtitle2" color="text.secondary">Buyer</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{selectedTransaction.buyerName} ({selectedTransaction.buyerEmail})</Typography>

              <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
              <Typography variant="h6" fontWeight={800} color="#1A6B8A" sx={{ mb: 2 }}>
                Rp {selectedTransaction.productPrice?.toLocaleString('id-ID')}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">Payment Method</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{selectedTransaction.paymentMethod}</Typography>

              <Typography variant="subtitle2" color="text.secondary">Payment Proof</Typography>
              {selectedTransaction.paymentProof && (
                <Box sx={{ mt: 1, mb: 3 }}>
                  <img src={selectedTransaction.paymentProof} alt="Payment Proof" style={{ maxWidth: '100%', borderRadius: 8 }} />
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Action</Typography>
              <Box display="flex" gap={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleVerify(selectedTransaction, 'paid')}
                  sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
                >
                  Approve Payment
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => handleVerify(selectedTransaction, 'rejected')}
                  sx={{ borderColor: '#EF4444', color: '#EF4444' }}
                >
                  Reject
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PaymentVerification;