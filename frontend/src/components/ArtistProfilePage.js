import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Avatar, Grid, Card, CardContent,
  Chip, Button, CircularProgress, Stack, Divider, Rating, Paper
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { artistService } from './services/artistService';

function ArtistProfilePage() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtistData();
  }, [artistId]);

  const loadArtistData = () => {
    setLoading(true);
    try {
      // Cari artist dari localStorage (artistService)
      const foundArtist = artistService.getById(artistId);
      if (foundArtist) {
        setArtist(foundArtist);
      }

      // Cari komisi milik artist ini
      const allCommissions = JSON.parse(localStorage.getItem('creartsi_artist_commissions') || '[]');
      const artistCommissions = allCommissions.filter(
        c => c.artistId === parseInt(artistId) ||
             c.artistName === foundArtist?.name ||
             c.artistName === foundArtist?.fullName
      );
      setCommissions(artistCommissions);
    } catch (error) {
      console.error('Error loading artist profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#4A9FBF' }} />
      </Box>
    );
  }

  if (!artist) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">Artist tidak ditemukan</Typography>
        <Button onClick={() => navigate('/artists')} sx={{ mt: 2 }}>Kembali ke Daftar Artist</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Banner */}
      <Box sx={{
        height: 200,
        bgcolor: '#4A9FBF',
        background: 'linear-gradient(135deg, #1A6B8A 0%, #4A9FBF 100%)',
        position: 'relative'
      }} />

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2, mb: 2, color: '#1A6B8A', fontWeight: 600 }}
        >
          Kembali
        </Button>

        {/* Profile Header */}
        <Paper sx={{ borderRadius: '24px', p: 4, mb: 4, mt: -6, position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'center', sm: 'flex-start' }}>
            <Avatar
              src={artist.avatar || artist.profilePicture || artist.avatarUrl}
              sx={{
                width: 100,
                height: 100,
                border: '4px solid white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                bgcolor: '#4A9FBF',
                fontSize: '2.5rem'
              }}
            >
              {artist.emoji || artist.name?.charAt(0)}
            </Avatar>

            <Box flex={1}>
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                <Typography variant="h4" fontWeight={800} sx={{ color: '#1A6B8A' }}>
                  {artist.name}
                </Typography>
                {artist.isVerified && (
                  <VerifiedIcon sx={{ color: '#4A9FBF', fontSize: 24 }} />
                )}
                <Chip
                  label={artist.category || artist.artCategory || artist.genre}
                  size="small"
                  sx={{ bgcolor: '#E0F2FE', color: '#1A6B8A', fontWeight: 600 }}
                />
              </Stack>

              <Typography variant="body1" sx={{ color: '#64748B', mt: 1, mb: 2 }}>
                {artist.bio || 'Seniman profesional di platform CreartsI'}
              </Typography>

              <Stack direction="row" spacing={3} flexWrap="wrap">
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={800} color="#1A6B8A">{artist.commissions || 0}</Typography>
                  <Typography variant="caption" color="text.secondary">Komisi</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={800} color="#1A6B8A">{artist.totalReviews || 0}</Typography>
                  <Typography variant="caption" color="text.secondary">Ulasan</Typography>
                </Box>
                <Box textAlign="center">
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Rating value={artist.rating || 0} precision={0.5} size="small" readOnly />
                    <Typography variant="body2" fontWeight={700} color="#1A6B8A">
                      {artist.rating ? artist.rating.toFixed(1) : '0.0'}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">Rating</Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Commission Packages */}
        <Typography variant="h5" fontWeight={700} sx={{ color: '#1A6B8A', mb: 3 }}>
          Paket Komisi
        </Typography>

        {commissions.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '20px' }}>
            <Typography variant="h6" color="text.secondary">Belum ada paket komisi</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Artist ini belum membuat paket komisi
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {commissions.map((comm) => (
              <Grid item xs={12} sm={6} md={4} key={comm.id}>
                <Card
                  onClick={() => navigate(`/artists/${comm.id}`)}
                  sx={{
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }
                  }}
                >
                  <Box sx={{ height: 160, bgcolor: '#F0F9FF', overflow: 'hidden' }}>
                    {comm.coverImage ? (
                      <img src={comm.coverImage} alt={comm.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                        <Typography fontSize="3rem">🎨</Typography>
                      </Box>
                    )}
                  </Box>
                  <CardContent>
                    <Chip
                      label={comm.isOpen ? 'OPEN' : 'CLOSED'}
                      size="small"
                      sx={{ bgcolor: comm.isOpen ? '#10B981' : '#EF4444', color: 'white', fontWeight: 700, mb: 1 }}
                    />
                    <Typography variant="subtitle1" fontWeight={700}>{comm.title}</Typography>
                    <Typography variant="caption" color="#4A9FBF">{comm.category}</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="h6" fontWeight={800} color="#1A6B8A">
                      Rp {comm.priceFrom?.toLocaleString('id-ID') || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default ArtistProfilePage;
