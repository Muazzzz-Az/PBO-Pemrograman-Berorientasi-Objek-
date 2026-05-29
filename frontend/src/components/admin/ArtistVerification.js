import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Chip, Box } from '@mui/material';

function ArtistVerification() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    // Ambil kiriman data pendaftar dari localStorage
    const savedSubmissions = JSON.parse(localStorage.getItem('artist_submissions')) || [
      { id: 1, name: 'Ahmad Syauqi', username: 'syauqi_art', portfolio: 'behance.net/syauqi', status: 'pending' },
      { id: 2, name: 'Caesar Ramadhan', username: 'caesar_draws', portfolio: 'artstation.com/caesar', status: 'pending' }
    ];
    setSubmissions(savedSubmissions);
  }, []);

  const handleAction = (id, newStatus) => {
    const updated = submissions.map(sub => {
      if (sub.id === id) {
        // Jika disetujui, buat bendera notifikasi untuk dibaca oleh navbar
        if (newStatus === 'approved') {
          localStorage.setItem('artist_notification', 'Selamat! Pengajuan Anda sebagai artist di Creartsl telah disetujui 🎉');
        }
        return { ...sub, status: newStatus };
      }
      return sub;
    });

    setSubmissions(updated);
    localStorage.setItem('artist_submissions', JSON.stringify(updated));
    alert(`Status pendaftaran berhasil diubah menjadi: ${newStatus}`);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ color: '#1A6B8A', fontWeight: 700, mb: 3 }}>
        Permintaan Verifikasi Artist
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#E0F2FE' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#1A6B8A' }}>Nama Kelompok/Kreator</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A6B8A' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A6B8A' }}>Tautan Portofolio</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A6B8A' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A6B8A', textAlign: 'center' }}>Aksi</TableCell>
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
                    <Typography variant="body2" color="textSecondary">Selesai dievaluasi</Typography>
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