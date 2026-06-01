// src/components/admin/ArtistVerification.js - FIXED with per-user notifications
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Chip, Box } from '@mui/material';

function ArtistVerification() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const savedSubmissions = JSON.parse(localStorage.getItem('artist_submissions')) || [
      { id: 1, name: 'Ahmad Syauqi', username: 'syauqi_art', portfolio: 'behance.net/syauqi', status: 'pending' },
      { id: 2, name: 'Caesar Ramadhan', username: 'caesar_draws', portfolio: 'artstation.com/caesar', status: 'pending' }
    ];
    setSubmissions(savedSubmissions);
  }, []);

  const handleAction = (id, newStatus) => {
    const updated = submissions.map(sub => {
      if (sub.id === id) {
        if (newStatus === 'approved') {
          // UPDATE USER IN LOCALSTORAGE
          const allUsers = JSON.parse(localStorage.getItem('registered_users')) || [];

          // Update in registered_users
          const updatedUsers = allUsers.map(user => {
            if (user.username === sub.username) {
              return {
                ...user,
                isVerified: true,
                role: 'artist'
              };
            }
            return user;
          });
          localStorage.setItem('registered_users', JSON.stringify(updatedUsers));

          // UPDATE CURRENT USER if logged in as that user
          const currentUser = JSON.parse(localStorage.getItem('user'));
          if (currentUser && currentUser.username === sub.username) {
            const updatedCurrentUser = {
              ...currentUser,
              isVerified: true,
              role: 'artist'
            };
            localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
            window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedCurrentUser }));
          }

          // 🔥 PERBAIKAN: Create notification for the approved user (bukan current admin!)
          const targetUser = allUsers.find(u => u.username === sub.username);
          if (targetUser) {
            const NOTIF_KEY = `user_notifications_${targetUser.id}`;
            const existingNotifications = JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]');
            const newNotification = {
              id: Date.now(),
              message: `🎉 Congratulations! Your artist application for @${sub.username} has been approved! You can now access Creator features.`,
              type: 'ARTIST_APPROVAL',
              isRead: false,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            existingNotifications.unshift(newNotification);
            localStorage.setItem(NOTIF_KEY, JSON.stringify(existingNotifications));
          }

          window.dispatchEvent(new Event('storage'));
        }
        return { ...sub, status: newStatus };
      }
      return sub;
    });

    setSubmissions(updated);
    localStorage.setItem('artist_submissions', JSON.stringify(updated));
    alert(`Application ${newStatus === 'approved' ? 'APPROVED' : 'REJECTED'} successfully!`);
  };

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