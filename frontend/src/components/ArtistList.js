// src/components/ArtistList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  InputAdornment,
  Button,
  Divider,
  Stack,
  Pagination,
  Skeleton,
  Rating,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { cartService } from '../services/RealTimeDataService';
import { getArtistData, getArtistReviews, getArtistCommissions } from '../services/ArtistDataService';

function ArtistList() {
  const [commissions, setCommissions] = useState([]);
  const [filteredCommissions, setFilteredCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('relevant');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Illustrations', label: 'Illustrations' },
    { value: '2D Avatars', label: '2D Avatars' },
    { value: '3D Models', label: '3D Models' },
    { value: 'Emotes + Badges', label: 'Emotes + Badges' },
    { value: 'Stream Assets', label: 'Stream Assets' },
    { value: 'Branding + Graphics', label: 'Branding + Graphics' },
    { value: 'Animation + Videos', label: 'Animation + Videos' }
  ];

  const sortOptions = [
    { value: 'relevant', label: 'Most Relevant' },
    { value: 'latest', label: 'Latest' },
    { value: 'trending', label: 'Trending' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [searchTerm, selectedCategory, sortBy, commissions]);

  const loadData = () => {
    setLoading(true);

    try {
      const allCommissions = getArtistCommissions();
      const openCommissions = allCommissions.filter(comm => comm.isOpen === true);

      const items = openCommissions.map(comm => {
        const artistName = comm.artistName || 'Artist';
        const artistData = getArtistData(artistName);
        const reviewData = getArtistReviews(comm.artistId, artistName);

        const finalRating = (reviewData.totalReviews > 0 && reviewData.rating > 0)
          ? reviewData.rating
          : (artistData.rating || 0);
        const finalReviews = (reviewData.totalReviews > 0)
          ? reviewData.totalReviews
          : (artistData.totalReviews || 0);

        return {
          id: comm.id,
          title: comm.title || 'Commission Package',
          artistName: artistData.name,
          artistUsername: artistData.username,
          artistAvatar: artistData.avatar,
          artistRating: finalRating,
          artistReviews: finalReviews,
          isVerified: artistData.isVerified,
          category: comm.category || 'General',
          price: comm.priceFrom || 0,
          coverImage: comm.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
          tags: comm.includes || [],
          slotsLeft: comm.slotsLeft || comm.slots || 5,
          createdAt: comm.createdAt || new Date().toISOString()
        };
      });

      setCommissions(items);
    } catch (error) {
      console.error('Error loading commissions:', error);
      setCommissions([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSort = () => {
    let result = [...commissions];

    if (searchTerm) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.artistName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }

    switch (sortBy) {
      case 'latest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'trending':
        result.sort((a, b) => (b.artistReviews || 0) - (a.artistReviews || 0));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.artistRating || 0) - (a.artistRating || 0));
        break;
      default:
        break;
    }

    setFilteredCommissions(result);
    setPage(1);
  };

  const totalPages = Math.ceil(filteredCommissions.length / itemsPerPage);
  const paginatedItems = filteredCommissions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Box sx={{ bgcolor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', pt: 4, pb: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={800} sx={{ color: '#1A6B8A', mb: 1 }}>
            Find Your Perfect Artist
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B' }}>
            Browse through talented Indonesian artists and find the perfect match for your creative project
          </Typography>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', py: 2 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Search by artist or commission title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#94A3B8' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '40px', bgcolor: '#F8FAFC', '& fieldset': { borderColor: '#E2E8F0' } }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterListIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '40px', bgcolor: '#F8FAFC' }
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                size="small"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SortIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '40px', bgcolor: '#F8FAFC' }
                }}
              >
                {sortOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            <strong>{filteredCommissions.length}</strong> commissions found
          </Typography>
        </Box>

        {loading && (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rounded" width="100%" height={380} sx={{ borderRadius: '16px' }} />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && filteredCommissions.length === 0 && (
          <Paper sx={{ textAlign: 'center', py: 8, borderRadius: '24px' }}>
            <Typography variant="h5" sx={{ color: '#94A3B8', mb: 1 }}>No commissions found</Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>Try adjusting your search or filter</Typography>
          </Paper>
        )}

        {!loading && filteredCommissions.length > 0 && (
          <>
            <Grid container spacing={3}>
              {paginatedItems.map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.id}>
                  <Card
                    component={Link}
                    to={`/artists/${item.id}`}
                    sx={{
                      textDecoration: 'none',
                      bgcolor: '#FFFFFF',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        borderColor: '#4A9FBF'
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 180, overflow: 'hidden', bgcolor: '#F1F5F9' }}>
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Chip
                        label="OPEN"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          bgcolor: '#10B981',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          borderRadius: '20px'
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 2, flexGrow: 1 }}>
                      <Typography variant="caption" sx={{ color: '#4A9FBF', fontWeight: 600 }}>
                        {item.category}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 0.5, mb: 1, lineHeight: 1.3, fontSize: '0.95rem' }}>
                        {item.title}
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Avatar src={item.artistAvatar} sx={{ width: 20, height: 20 }} />
                        <Typography variant="caption" fontWeight={600} sx={{ color: '#334155' }}>
                          {item.artistName}
                        </Typography>
                        {item.isVerified && <VerifiedIcon sx={{ color: '#4A9FBF', fontSize: 12 }} />}
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5 }}>
                        {item.artistRating > 0 ? (
                          <>
                            <Rating value={item.artistRating} precision={0.5} size="small" readOnly />
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>({item.artistReviews})</Typography>
                          </>
                        ) : (
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>⭐ No reviews yet</Typography>
                        )}
                      </Stack>

                      <Typography variant="h6" fontWeight={800} sx={{ color: '#1A6B8A' }}>
                        Rp {item.price.toLocaleString('id-ID')}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.5 }}>
                        {item.slotsLeft} slots available
                      </Typography>
                    </CardContent>

                    <Divider />
                    <Box sx={{ p: 1.5 }}>
                      <Button
                        component={Link}
                        to={`/artists/${item.id}`}
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: '40px',
                          textTransform: 'none',
                          fontWeight: 600,
                          color: '#4A9FBF',
                          borderColor: '#E2E8F0',
                          '&:hover': { borderColor: '#4A9FBF', bgcolor: 'rgba(74,159,191,0.05)' }
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={5}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: '10px',
                      '&.Mui-selected': { bgcolor: '#4A9FBF', color: 'white' }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default ArtistList;