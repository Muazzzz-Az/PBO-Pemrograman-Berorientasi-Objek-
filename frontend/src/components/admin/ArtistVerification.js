// src/components/admin/ArtistVerification.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Chip, Box } from '@mui/material';
import toast from 'react-hot-toast';

function ArtistVerification() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    // TAMPILAN TETAP PAKAI DATA DARI LOCALSTORAGE DULU (Biar keliatan semua user)
    const savedSubmissions = JSON.parse(localStorage.getItem('artist_submissions')) || [
      { id: 1, name: 'Ahmad Syauqi', username: 'syauqi_art', portfolio: 'behance.net/syauqi', status: 'pending' },
      { id: 2, name: 'Caesar Ramadhan', username: 'caesar_draws', portfolio: 'artstation.com/caesar', status: 'pending' }
    ];
    setSubmissions(savedSubmissions);

    // TAPI TAMBAHKAN SYNC DARI BACKEND (Biar statusnya sesuai database)
    syncFromBackend();
  }, []);

  // 🔥 TAMBAHAN: Sync status dari backend
  const syncFromBackend = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/pending-artists');
      const data = await response.json();

      if (data.success && data.data) {
        // Update status submissions berdasarkan data backend
        setSubmissions(prev => {
          const updated = prev.map(sub => {
            const backendUser = data.data.find(u => u.username === sub.username);
            if (backendUser) {
              return { ...sub, status: backendUser.isVerified ? 'approved' : 'pending' };
            }
            return sub;
          });
          localStorage.setItem('artist_submissions', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  const handleAction = async (id, newStatus) => {
    const currentSub = submissions.find(sub => sub.id === id);

    if (newStatus === 'approved') {
      // 🔥 CARI USER ID DARI BACKEND DULU
      try {
        const response = await fetch('http://localhost:8080/api/admin/pending-artists');
        const data = await response.json();
        const backendUser = data.data?.find(u => u.username === currentSub.username);
        const userId = backendUser?.id;

        if (!userId) {
          toast.error(`User ${currentSub.username} tidak ditemukan di backend!`);
          return;
        }

        // APPROVE KE BACKEND
        const approveRes = await fetch(`http://localhost:8080/api/admin/approve-artist/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const approveData = await approveRes.json();

        if (approveRes.ok && approveData.success) {
          // LANJUTKAN LOGIC ASLI TEMANMU (UPDATE LOCALSTORAGE DLL)
          const allUsers = JSON.parse(localStorage.getItem('registered_users')) || [];

          const updatedUsers = allUsers.map(user => {
            if (user.username === currentSub.username) {
              return {
                ...user,
                isVerified: true,
                role: 'artist'
              };
            }
            return user;
          });
          localStorage.setItem('registered_users', JSON.stringify(updatedUsers));

          const currentUser = JSON.parse(localStorage.getItem('user'));
          if (currentUser && currentUser.username === currentSub.username) {
            const updatedCurrentUser = {
              ...currentUser,
              isVerified: true,
              role: 'artist'
            };
            localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
            window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedCurrentUser }));
          }

          const targetUser = allUsers.find(u => u.username === currentSub.username);
          if (targetUser) {
            const NOTIF_KEY = `user_notifications_${targetUser.id}`;
            const existingNotifications = JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]');
            const newNotification = {
              id: Date.now(),
              message: `🎉 Congratulations! Your artist application for @${currentSub.username} has been approved! You can now access Creator features.`,
              type: 'ARTIST_APPROVAL',
              isRead: false,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            existingNotifications.unshift(newNotification);
            localStorage.setItem(NOTIF_KEY, JSON.stringify(existingNotifications));
          }

          window.dispatchEvent(new Event('storage'));

          // UPDATE STATUS DI SUBMISSIONS
          const updated = submissions.map(sub => {
            if (sub.id === id) {
              return { ...sub, status: 'approved' };
            }
            return sub;
          });
          setSubmissions(updated);
          localStorage.setItem('artist_submissions', JSON.stringify(updated));

          toast.success(`Application APPROVED successfully!`);
        } else {
          toast.error(`Failed: ${approveData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(`Failed to approve: ${error.message}`);
      }
    } else {
      // REJECTED - PAKAI LOGIC ASLI TEMANMU
      const updated = submissions.map(sub => {
        if (sub.id === id) {
          return { ...sub, status: 'rejected' };
        }
        return sub;
      });
      setSubmissions(updated);
      localStorage.setItem('artist_submissions', JSON.stringify(updated));
      toast.success(`Application REJECTED successfully!`);
    }
  };

  // TAMPILAN SAMA PERSIS DENGAN ASLINYA (TIDAK ADA YANG DIUBAH)
  return (
    <Box>
      <Typography variant="h6" sx={{ color: '#1A6B8A', fontWeight: 700, mb: 3 }}>
        Artist Verification Requests
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#E0F2FE' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#1A6B8A' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A6B8A' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A6B8A' }}>Portfolio Link</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A6B8A' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A6B8A', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.name}</TableCell>
                <TableCell>@{row.username}</TableCell>
                <TableCell>
                  <a href={row.portfolio.startsWith('http') ? row.portfolio : `https://${row.portfolio}`} target="_blank" rel="noreferrer" style={{ color: '#4A9FBF', fontWeight: 600 }}>
                    {row.portfolio}
                  </a>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status.toUpperCase()}
                    color={row.status === 'pending' ? 'warning' : row.status === 'approved' ? 'success' : 'error'}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell align="center">
                  {row.status === 'pending' ? (
                    <Box display="flex" justifyContent="center" gap={1}>
                      <Button variant="contained" color="success" size="small" onClick={() => handleAction(row.id, 'approved')} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                        Approve
                      </Button>
                      <Button variant="contained" color="error" size="small" onClick={() => handleAction(row.id, 'rejected')} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                        Reject
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">Completed</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ArtistVerification;