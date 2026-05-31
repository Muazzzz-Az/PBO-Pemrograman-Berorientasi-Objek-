// src/components/artist/ArtistNotifications.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  ShoppingBag as ShoppingBagIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

function ArtistNotifications({ artistId, artistName }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);

  useEffect(() => {
    loadNotifications();

    const handleStorageChange = (e) => {
      if (e.key === `artist_notifications_${artistId}`) {
        loadNotifications();
      }
    };

    const handleNewRequest = (event) => {
      if (event.detail) {
        loadNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('newCommissionRequest', handleNewRequest);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('newCommissionRequest', handleNewRequest);
    };
  }, [artistId]);

  const loadNotifications = () => {
    const saved = JSON.parse(localStorage.getItem(`artist_notifications_${artistId}`) || '[]');
    setNotifications(saved);
    const unread = saved.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (notifId) => {
    const updated = notifications.map(notif =>
      notif.id === notifId ? { ...notif, isRead: true } : notif
    );
    localStorage.setItem(`artist_notifications_${artistId}`, JSON.stringify(updated));
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.isRead).length);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map(notif => ({ ...notif, isRead: true }));
    localStorage.setItem(`artist_notifications_${artistId}`, JSON.stringify(updated));
    setNotifications(updated);
    setUnreadCount(0);
  };

  const handleViewRequest = (notif) => {
    handleMarkAsRead(notif.id);
    setSelectedRequest(notif);
    setOpenRequestDialog(true);
    handleCloseMenu();
  };

  const handleUpdateRequestStatus = (requestId, newStatus) => {
    // Update commission request status
    const allRequests = JSON.parse(localStorage.getItem('commission_requests') || '[]');
    const updatedRequests = allRequests.map(req => {
      if (req.id === requestId) {
        return { ...req, status: newStatus };
      }
      return req;
    });
    localStorage.setItem('commission_requests', JSON.stringify(updatedRequests));

    // Update notification
    const updatedNotifs = notifications.map(notif => {
      if (notif.requestId === requestId) {
        return { ...notif, status: newStatus };
      }
      return notif;
    });
    localStorage.setItem(`artist_notifications_${artistId}`, JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs);

    // Notify buyer
    const buyerNotification = {
      id: Date.now(),
      message: `Artist ${artistName} has ${newStatus} your commission request.`,
      type: 'REQUEST_UPDATE',
      isRead: false,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    const globalNotifs = JSON.parse(localStorage.getItem('user_notifications') || '[]');
    globalNotifs.unshift(buyerNotification);
    localStorage.setItem('user_notifications', JSON.stringify(globalNotifs));
    window.dispatchEvent(new Event('storage'));

    alert(`Request ${newStatus} successfully!`);
    setOpenRequestDialog(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'NEW_COMMISSION_REQUEST':
        return <ShoppingBagIcon sx={{ color: '#4A9FBF' }} />;
      default:
        return <NotificationsIcon sx={{ color: '#4A9FBF' }} />;
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" size="small" color="warning" />;
      case 'accepted':
        return <Chip label="Accepted" size="small" color="success" />;
      case 'rejected':
        return <Chip label="Rejected" size="small" color="error" />;
      default:
        return null;
    }
  };

  return (
    <>
      <IconButton onClick={handleOpenMenu} sx={{ color: '#5D6D7E' }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            borderRadius: '16px',
            mt: 1.5,
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
          <Typography variant="subtitle1" fontWeight={700} color="#1A6B8A">
            Commission Requests
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllAsRead} sx={{ textTransform: 'none', fontSize: '0.7rem' }}>
              Mark all read
            </Button>
          )}
        </Box>

        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">No commission requests yet</Typography>
            </Box>
          ) : (
            notifications.map((notif, index) => (
              <MenuItem
                key={notif.id}
                onClick={() => handleViewRequest(notif)}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  p: 2,
                  borderBottom: index !== notifications.length - 1 ? '1px solid #F1F5F9' : 'none',
                  backgroundColor: notif.isRead ? 'transparent' : '#F0F9FF'
                }}
              >
                <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getNotificationIcon(notif.type)}
                    <Typography variant="body2" fontWeight={notif.isRead ? 500 : 700}>
                      {notif.title}
                    </Typography>
                  </Box>
                  {getStatusChip(notif.status)}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                  {notif.message}
                </Typography>
                <Box display="flex" justifyContent="space-between" width="100%" mt={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    {notif.timeAgo || new Date(notif.timestamp).toLocaleTimeString()}
                  </Typography>
                  <Typography variant="caption" fontWeight={600} color="#1A6B8A">
                    Rp {notif.price?.toLocaleString('id-ID')}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Box>
      </Menu>

      {/* Request Detail Dialog */}
      <Dialog open={openRequestDialog} onClose={() => setOpenRequestDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#4A9FBF', color: 'white' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={700}>Commission Request Details</Typography>
            <IconButton onClick={() => setOpenRequestDialog(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedRequest && (
            <Box>
              <Card sx={{ mb: 3, borderRadius: '16px' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700} color="#1A6B8A" gutterBottom>
                    Request from: {selectedRequest.buyerName} (@{selectedRequest.buyerUsername})
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Commission: {selectedRequest.commissionTitle}
                  </Typography>
                  <Typography variant="h6" fontWeight={800} color="#4A9FBF">
                    Budget: Rp {selectedRequest.price?.toLocaleString('id-ID')}
                  </Typography>
                </CardContent>
              </Card>

              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1A6B8A' }}>
                What would you like to do?
              </Typography>

              <Box display="flex" gap={2} sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleUpdateRequestStatus(selectedRequest.requestId, 'accepted')}
                  sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
                >
                  Accept Request
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => handleUpdateRequestStatus(selectedRequest.requestId, 'rejected')}
                  sx={{ borderColor: '#EF4444', color: '#EF4444' }}
                >
                  Decline Request
                </Button>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => {
                  setOpenRequestDialog(false);
                  // Navigate to chat or more details
                }}
                sx={{ mt: 2, borderColor: '#4A9FBF', color: '#4A9FBF' }}
              >
                View Full Details & Chat with Buyer
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ArtistNotifications;