import React, { useState } from 'react';
import {
  Box, Typography, MenuItem, IconButton, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, alpha
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const UserNotifications = ({ notifications, onMarkAsRead, onClear, handleLogout }) => {
  const [openReLogin, setOpenReLogin] = useState(false);

  const handleNotifClick = (notif) => {
    onMarkAsRead(notif.id);
    // Cek jika tipe notifikasinya adalah persetujuan artist
    if (notif.type === 'ARTIST_APPROVAL') {
      setOpenReLogin(true);
    }
  };

  return (
    <>
      <Box sx={{ maxHeight: 380, overflowY: 'auto', width: 320 }}>
        {notifications.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography variant="body2" color="textSecondary">Tidak ada notifikasi</Typography>
          </Box>
        ) : (
          notifications.map((notif) => (
            <MenuItem
              key={notif.id}
              onClick={() => handleNotifClick(notif)}
              sx={{
                p: 2,
                flexDirection: 'column',
                alignItems: 'flex-start',
                backgroundColor: notif.isRead ? 'transparent' : alpha('#4A9FBF', 0.04),
                borderBottom: '1px solid rgba(74, 159, 191, 0.05)',
                '&:hover': { backgroundColor: alpha('#4A9FBF', 0.08) }
              }}
            >
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography variant="body2" fontWeight={700} color="#1A6B8A">
                   {notif.type === 'ARTIST_APPROVAL' ? '🎉 Akun Artist Disetujui' : '📢 Notifikasi'}
                </Typography>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onClear(notif.id); }}>
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
              <Typography variant="body2" color="#64748B">{notif.message}</Typography>
              <Typography variant="caption" color="#94A3B8" mt={0.5}>{notif.timestamp}</Typography>
            </MenuItem>
          ))
        )}
      </Box>

      {/* POPUP PAKSA LOGIN ULANG */}
      <Dialog open={openReLogin} onClose={() => setOpenReLogin(false)}>
        <DialogTitle sx={{ fontWeight: 800, color: '#1A6B8A' }}>Selamat Jadi Artist!</DialogTitle>
        <DialogContent>
          <Typography>Status akun kamu sudah berubah. Silakan login ulang untuk mengakses fitur Artist kamu ya.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" fullWidth onClick={handleLogout} sx={{ bgcolor: '#4A9FBF' }}>
            Login Ulang Sekarang
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserNotifications;