// HomePage.js - Unified Feed with Filters
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Avatar, Stack, Chip, Modal, IconButton, Skeleton, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CheckIcon from '@mui/icons-material/Check';
import ChatIcon from '@mui/icons-material/Chat';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import {
  Palette, Layers, Create, AutoAwesome,
  VideoCameraBack, ContentPaste
} from '@mui/icons-material';

// ==========================================
// SERVICE CATEGORIES DATA
// ==========================================
const serviceCategories = [
  { title: 'Illustrations', gradient: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', color: '#1E88E5', icon: <Palette /> },
  { title: '2D Avatars', gradient: 'linear-gradient(135deg, #EDE7F6 0%, #D1C4E9 100%)', color: '#5E35B1', icon: <Layers /> },
  { title: '3D Models', gradient: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)', color: '#00897B', icon: <AutoAwesome /> },
  { title: 'Emotes + Badges', gradient: 'linear-gradient(135deg, #FFFDE7 0%, #FFF59D 100%)', color: '#FBC02D', icon: <Create /> },
  { title: 'Stream Assets', gradient: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)', color: '#E53935', icon: <VideoCameraBack /> },
  { title: 'Branding + Graphics', gradient: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)', color: '#43A047', icon: <ContentPaste /> },
  { title: 'Animation + Videos', gradient: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)', color: '#D81B60', icon: <VideoCameraBack /> },
];

// ==========================================
// GET DATA FROM STORAGE
// ==========================================
const getArtistCommissions = () => {
  const saved = localStorage.getItem('creartsi_artist_commissions');
  return saved ? JSON.parse(saved) : [];
};

const getArtistPortfolio = () => {
  const saved = localStorage.getItem('creartsi_artist_portfolio');
  return saved ? JSON.parse(saved) : [];
};

// ==========================================
// HERO SECTION - Image on RIGHT
// ==========================================
const HeroSection = () => (
  <Box sx={{
    minHeight: '80vh',
    background: 'linear-gradient(135deg, #E8F4F8 0%, #C9E6F0 60%, #FFF9E6 100%)',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <Container maxWidth="xl" sx={{ py: { xs: 6, md: 4 } }}>
      <Grid container spacing={6} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }}>
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Chip
              label=" Indonesia's Creator Commission Platform "
              sx={{
                bgcolor: '#FFFFFF',
                color: '#1A6B8A',
                fontWeight: 700,
                border: '1px solid rgba(26,107,138,0.2)',
                mb: 4,
                px: 2.5,
                py: 2,
                borderRadius: '30px',
                fontSize: '0.85rem'
              }}
            />
            <Typography variant="h1" sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 800,
              color: '#1A6B8A',
              mb: 3,
              lineHeight: 1.2
            }}>
              Made for <span style={{ color: '#4A9FBF' }}>Indonesian Creators</span>
            </Typography>
            <Typography variant="body1" sx={{
              color: '#5D6D7E',
              mb: 5,
              maxWidth: '550px',
              fontSize: '1.1rem',
              lineHeight: 1.7
            }}>
              Commission platform for illustrations, avatars, 3D models, and all your creative needs.
              Connect directly with talented Indonesian artists.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Button
                component={Link}
                to="/artists"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#4A9FBF',
                  color: 'white',
                  '&:hover': { bgcolor: '#1A6B8A' },
                  borderRadius: '50px',
                  px: 5,
                  py: 1.8,
                  fontWeight: 700,
                  fontSize: '1rem'
                }}
              >
                🎨 Explore Artists
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#4A9FBF',
                  color: '#4A9FBF',
                  borderRadius: '50px',
                  px: 5,
                  py: 1.8,
                  fontWeight: 700,
                  fontSize: '1rem',
                  '&:hover': { bgcolor: 'rgba(74,159,191,0.05)', borderColor: '#1A6B8A' }
                }}
              >
                Join as Artist
              </Button>
            </Stack>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600"
              sx={{
                width: '100%',
                height: '450px',
                objectFit: 'cover',
                borderRadius: '28px',
                border: '6px solid #FFFFFF',
                boxShadow: '0 25px 45px rgba(0,0,0,0.1)',
                display: 'block',
                marginLeft: 'auto'
              }}
            />
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

// ==========================================
// SERVICE CATEGORIES SECTION
// ==========================================
const ServiceCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (title) => {
    const pathMap = {
      'Illustrations': 'illustrations',
      '2D Avatars': '2d-avatars',
      '3D Models': '3d-models',
      'Emotes + Badges': 'emotes-badges',
      'Stream Assets': 'stream-assets',
      'Branding + Graphics': 'branding-graphics',
      'Animation + Videos': 'animation-videos'
    };
    const path = pathMap[title] || title.toLowerCase().replace(/ /g, '-').replace(/\+/g, '');
    navigate(`/category/${path}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 5, color: '#1A6B8A', textAlign: 'center' }}>
        Commission Services
      </Typography>
      <Grid container spacing={3}>
        {serviceCategories.map((service, idx) => (
          <Grid item xs={6} sm={4} md={3} key={idx}>
            <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
              <Card
                onClick={() => handleCategoryClick(service.title)}
                sx={{
                  background: service.gradient,
                  p: 3.5,
                  height: '130px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 24px rgba(74, 159, 191, 0.15)'
                  }
                }}
              >
                <Box sx={{ color: service.color, fontSize: 42, mb: 1.5 }}>
                  {service.icon}
                </Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: service.color }}>
                  {service.title}
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

// ==========================================
// PLATFORM COMMITMENT SECTION
// ==========================================
const PlatformCommitment = () => (
  <Container maxWidth="xl" sx={{ my: 6 }}>
    <Box sx={{
      bgcolor: '#F8FAFC',
      py: 6,
      px: 5,
      borderRadius: '28px',
      textAlign: 'center',
      border: '1px solid #E2E8F0'
    }}>
      <Typography variant="h5" fontWeight={800} sx={{ color: '#1A6B8A', mb: 2 }}>
        NO AI 🚫
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: '650px', mx: 'auto', color: '#475569', lineHeight: 1.7 }}>
        100% artwork made by Indonesian artists. We do not allow AI-generated content
        to ensure every piece is a result of genuine human creativity.
      </Typography>
    </Box>
  </Container>
);

// ==========================================
// MAIN HOMEPAGE COMPONENT - UNIFIED FEED
// ==========================================
function HomePage() {
  const [feedItems, setFeedItems] = useState([]);
  const [filter, setFilter] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const loadFeed = () => {
      setLoading(true);

      // Get commissions and portfolio
      const commissions = getArtistCommissions().filter(comm => comm.isOpen === true);
      const portfolio = getArtistPortfolio();

      // Format commissions as feed items
      const commissionItems = commissions.map(comm => ({
        id: `comm-${comm.id}`,
        type: 'commission',
        title: comm.title || 'Commission Package',
        artistName: comm.artistName || 'Artist',
        category: comm.category || 'General',
        price: `Rp ${comm.priceFrom?.toLocaleString('id-ID') || '0'}`,
        rating: 5.0,
        reviews: 0,
        avatar: 'https://i.pravatar.cc/150?img=1',
        imageUrl: comm.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
        description: comm.description || '',
        turnaround: comm.turnaround || '7-14 days',
        revisions: comm.revisions || 2,
        slots: comm.slots || 5,
        tags: [comm.category],
        createdAt: comm.createdAt || new Date().toISOString(),
        likes: Math.floor(Math.random() * 100)
      }));

      // Format portfolio as feed items
      const portfolioItems = portfolio.map(item => ({
        id: `port-${item.id}`,
        type: 'portfolio',
        title: item.title,
        artistName: item.artistName || 'Artist',
        category: item.medium || 'Artwork',
        price: null,
        rating: null,
        avatar: 'https://i.pravatar.cc/150?img=1',
        imageUrl: item.imageUrl,
        description: item.description || '',
        tags: item.tags || [],
        createdAt: item.createdAt || new Date().toISOString(),
        likes: Math.floor(Math.random() * 200)
      }));

      // Combine and sort
      let allItems = [...commissionItems, ...portfolioItems];

      // Sort by date for latest
      allItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setFeedItems(allItems);
      setLoading(false);
    };

    loadFeed();

    const handleStorageChange = () => loadFeed();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter items based on selected filter
  const getFilteredItems = () => {
    let items = [...feedItems];

    switch (filter) {
      case 'latest':
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'trending':
        items.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'random':
        items = [...items].sort(() => Math.random() - 0.5);
        break;
      default:
        break;
    }

    return items.slice(0, 12);
  };

  const filteredItems = getFilteredItems();

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleOpenModal = (item) => setSelectedItem(item);
  const handleCloseModal = () => setSelectedItem(null);

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#F2F7F9', minHeight: '100vh' }}>
        <HeroSection />
        <ServiceCategories />
        <Container maxWidth="xl" sx={{ py: 5 }}>
          <Skeleton variant="rounded" width={200} height={40} sx={{ mx: 'auto', mb: 4 }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rounded" width="100%" height={320} sx={{ borderRadius: '20px' }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F2F7F9', minHeight: '100vh', pb: 8 }}>
      <HeroSection />
      <ServiceCategories />

      {/* UNIFIED FEED SECTION */}
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1A6B8A' }}>
            Discover
          </Typography>

          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilterChange}
            aria-label="feed filter"
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '40px !important',
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                border: '1px solid #E2E8F0',
                color: '#64748B',
                '&.Mui-selected': {
                  bgcolor: '#4A9FBF',
                  color: 'white',
                  borderColor: '#4A9FBF',
                  '&:hover': { bgcolor: '#1A6B8A' }
                }
              }
            }}
          >
            <ToggleButton value="latest">
              <AccessTimeIcon sx={{ mr: 1, fontSize: 18 }} /> Latest
            </ToggleButton>
            <ToggleButton value="trending">
              <WhatshotIcon sx={{ mr: 1, fontSize: 18 }} /> Trending
            </ToggleButton>
            <ToggleButton value="random">
              <ShuffleIcon sx={{ mr: 1, fontSize: 18 }} /> Random
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {filteredItems.length === 0 ? (
          <Box sx={{
            textAlign: 'center',
            py: 12,
            bgcolor: '#FFFFFF',
            borderRadius: '28px',
            border: '1px solid #E2E8F0'
          }}>
            <Typography variant="h5" sx={{ color: '#4A9FBF', mb: 2, fontWeight: 700 }}>
               No Content Yet
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>
              No commissions or portfolio items available. Be the first to share!
            </Typography>
            <Button
              component={Link}
              to="/for-artists"
              variant="contained"
              sx={{
                bgcolor: '#4A9FBF',
                borderRadius: '50px',
                textTransform: 'none',
                px: 5,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
               Join as Artist
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={item.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card
                      onClick={() => handleOpenModal(item)}
                      sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                        '&:hover': {
                          boxShadow: '0 20px 35px rgba(74, 159, 191, 0.15)',
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                        <Box
                          component="img"
                          src={item.imageUrl}
                          alt={item.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s',
                            '&:hover': { transform: 'scale(1.05)' }
                          }}
                        />
                        {item.type === 'commission' ? (
                          <Chip
                            label="Commission"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 16,
                              left: 16,
                              bgcolor: '#4A9FBF',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              borderRadius: '20px'
                            }}
                          />
                        ) : (
                          <Chip
                            label="Portfolio"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 16,
                              left: 16,
                              bgcolor: '#8B5CF6',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              borderRadius: '20px'
                            }}
                          />
                        )}
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            bgcolor: 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: '#FFFFFF' }
                          }}
                        >
                          <BookmarkBorderIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                        <Typography variant="caption" sx={{ color: '#4A9FBF', fontWeight: 700, letterSpacing: '0.5px' }}>
                          {item.category}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 1, mb: 1.5, lineHeight: 1.3, minHeight: '48px' }}>
                          {item.title}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                          <Avatar src={item.avatar} sx={{ width: 28, height: 28 }} />
                          <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>{item.artistName}</Typography>
                          <VerifiedIcon sx={{ color: '#4A9FBF', fontSize: 14 }} />
                        </Stack>

                        {item.type === 'commission' && item.price && (
                          <Typography variant="h6" fontWeight={800} sx={{ color: '#1A6B8A' }}>
                            {item.price}
                          </Typography>
                        )}

                        {item.tags && item.tags.length > 0 && (
                          <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                            {item.tags.slice(0, 2).map((tag, idx) => (
                              <Chip
                                key={idx}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.65rem', height: '24px' }}
                              />
                            ))}
                          </Stack>
                        )}

                        {item.type === 'commission' && (
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}>
                            <StarIcon sx={{ color: '#FBBF24', fontSize: 16 }} />
                            <Typography variant="body2" fontWeight={700}>{item.rating}</Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>({item.reviews} reviews)</Typography>
                          </Stack>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Container>

      <PlatformCommitment />

      {/* DETAIL MODAL - Supports both Commission and Portfolio */}
      <Modal
        open={Boolean(selectedItem)}
        onClose={handleCloseModal}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}
      >
        <Box sx={{ outline: 'none', width: '100%', maxWidth: '1050px' }}>
          {selectedItem && (
            <Box sx={{
              bgcolor: '#FFFFFF',
              borderRadius: '28px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              maxHeight: '90vh'
            }}>
              {/* LEFT SIDE - IMAGE */}
              <Box sx={{ flex: 1.2, bgcolor: '#F8FAFC', overflowY: 'auto' }}>
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </Box>

              {/* RIGHT SIDE - DETAILS */}
              <Box sx={{ flex: 1, p: 4, overflowY: 'auto', position: 'relative' }}>
                <IconButton
                  onClick={handleCloseModal}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': { bgcolor: '#F1F5F9' }
                  }}
                >
                  <CloseIcon />
                </IconButton>

                <Chip
                  label={selectedItem.type === 'commission' ? 'Commission' : 'Portfolio'}
                  size="small"
                  sx={{
                    bgcolor: selectedItem.type === 'commission' ? '#4A9FBF' : '#8B5CF6',
                    color: 'white',
                    fontWeight: 700,
                    mb: 2
                  }}
                />

                <Typography variant="h4" fontWeight={800} sx={{ mb: 2, color: '#1A6B8A' }}>
                  {selectedItem.title}
                </Typography>

                {selectedItem.type === 'commission' && (
                  <>
                    <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>Starting from</Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ color: '#4A9FBF', mb: 3 }}>
                      {selectedItem.price}
                    </Typography>
                  </>
                )}

                <Typography variant="body2" sx={{ color: '#475569', mb: 4, lineHeight: 1.7 }}>
                  {selectedItem.description || 'No description provided.'}
                </Typography>

                {selectedItem.type === 'commission' && (
                  <Box sx={{ display: 'flex', gap: 4, mb: 4, pb: 3, borderBottom: '1px solid #E2E8F0' }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Turnaround</Typography>
                      <Typography variant="body1" fontWeight={700}>{selectedItem.turnaround}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Revisions</Typography>
                      <Typography variant="body1" fontWeight={700}>{selectedItem.revisions}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Slots Left</Typography>
                      <Typography variant="body1" fontWeight={700}>{selectedItem.slots}</Typography>
                    </Box>
                  </Box>
                )}

                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 1, display: 'block' }}>
                      Tags
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {selectedItem.tags.map((tag, idx) => (
                        <Chip key={idx} label={tag} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4, p: 2.5, bgcolor: '#F8FAFC', borderRadius: '20px' }}>
                  <Avatar src={selectedItem.avatar} sx={{ width: 56, height: 56 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800}>{selectedItem.artistName}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>Verified Artist</Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{ ml: 'auto', borderRadius: '40px', textTransform: 'none', fontWeight: 600 }}
                  >
                    Send Message
                  </Button>
                </Stack>

                <Button
                  component={Link}
                  to="/artists"
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: '#4A9FBF',
                    borderRadius: '50px',
                    py: 1.8,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    '&:hover': { bgcolor: '#1A6B8A' }
                  }}
                >
                  {selectedItem.type === 'commission' ? 'Request Commission' : 'View More Artwork'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default HomePage;