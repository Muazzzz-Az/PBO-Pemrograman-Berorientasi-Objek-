import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  Modal,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CheckIcon from '@mui/icons-material/Check';

import {
  Palette,
  Layers,
  Create,
  AutoAwesome,
  VideoCameraBack,
  ContentPaste,
  InfoOutlined as InfoIcon,
  ChatBubbleOutlineOutlined as ChatBubbleOutlineIcon
} from '@mui/icons-material';

const featuredCommissions = [
  {
    id: 1,
    title: 'Tempura Mermaid Chibi YCH Live2D model Vtuber Food',
    artistName: 'Starlight',
    category: '2D Avatars',
    price: 'IDR 693.802',
    rating: 5.0,
    reviews: 56,
    emoji: '🌸',
    avatar: 'https://i.pravatar.cc/150?img=47',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600'],
    licenses: ['Personal Use Only', 'Monetized Content Allowed', 'Commercial Merchandising']
  },
  {
    id: 2,
    title: '"Watercolor" Portrait Custom Illustration Fantasy Style',
    artistName: 'Piaww',
    category: 'Illustrations',
    price: 'IDR 350.000',
    rating: 4.9,
    reviews: 140,
    emoji: '🎨',
    avatar: 'https://i.pravatar.cc/150?img=32',
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600'],
    licenses: ['Personal Use Only', 'Monetized Content Allowed']
  },
  {
    id: 3,
    title: 'Lo-fi Chill Beats & Background Music Asset for Streams',
    artistName: 'BubuRjagung',
    category: 'Music & Audio',
    price: 'IDR 500.000',
    rating: 4.8,
    reviews: 210,
    emoji: '🎵',
    avatar: 'https://i.pravatar.cc/150?img=12',
    images: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600'],
    licenses: ['Personal Use Only', 'Monetized Content Allowed']
  },
  {
    id: 4,
    title: 'Custom Stream Overlays, Badges & Twitch Emotes Pack',
    artistName: 'IkanAsin',
    category: 'Emotes + Badges',
    price: 'IDR 150.000',
    rating: 5.0,
    reviews: 320,
    emoji: '🐱',
    avatar: 'https://i.pravatar.cc/150?img=26',
    images: ['https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600'],
    licenses: ['Personal Use Only']
  }
];

const vgenServices = [
  { title: 'Illustrations', gradient: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', color: '#1E88E5', icon: <Palette /> },
  { title: '2D Avatars', gradient: 'linear-gradient(135deg, #EDE7F6 0%, #D1C4E9 100%)', color: '#5E35B1', icon: <Layers /> },
  { title: '3D Models', gradient: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)', color: '#00897B', icon: <AutoAwesome /> },
  { title: 'Emotes + Badges', gradient: 'linear-gradient(135deg, #FFFDE7 0%, #FFF59D 100%)', color: '#FBC02D', icon: <Create /> },
  { title: 'Stream Assets', gradient: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)', color: '#E53935', icon: <VideoCameraBack /> },
  { title: 'Branding + Graphics', gradient: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)', color: '#43A047', icon: <ContentPaste /> },
  { title: 'Animation + Videos', gradient: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)', color: '#D81B60', icon: <VideoCameraBack /> },
];

const HeroSection = () => (
  <Box sx={{ minHeight: '70vh', background: 'linear-gradient(135deg, #E8F4F8 0%, #C9E6F0 60%, #FFF9E6 100%)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
    <Container maxWidth="xl" sx={{ py: { xs: 6, md: 4 }, zIndex: 2 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={7}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Chip
              label="For the love of human creativity 🇮🇩"
              sx={{ bgcolor: '#FFFFFF', color: '#1A6B8A', fontWeight: 700, border: '1px solid rgba(26,107,138,0.2)', mb: 3, px: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.8rem' }, fontWeight: 950, color: '#1A6B8A', mb: 2, lineHeight: 1.15 }}>
              Made for <span style={{ color: '#4A9FBF' }}>Indonesian Creators</span><br />
              <span style={{ fontSize: '1.8rem', fontWeight: 600, color: '#5D6D7E' }}>di CreartsI dengan cinta ❤️</span>
            </Typography>
            <Typography variant="body1" sx={{ color: '#5D6D7E', mb: 4, fontWeight: 500, maxWidth: '600px', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Rumah komisi terbaik untuk VTubing, streaming, ilustrasi, musik, game, dan petualangan konten kreator asli Indonesia!
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component={Link} to="/artists" variant="contained" size="large" sx={{ bgcolor: '#4A9FBF', color: 'white', '&:hover': { bgcolor: '#1A6B8A' }, borderRadius: '16px', px: 4, py: 1.8, fontWeight: 700, fontSize: '1rem' }}>
                🎨 Jelajahi Seniman <ArrowForwardIcon sx={{ ml: 1 }} />
              </Button>
              <Button component={Link} to="/register" variant="outlined" size="large" sx={{ borderColor: '#4A9FBF', color: '#4A9FBF', '&:hover': { bgcolor: 'rgba(74,159,191,0.05)', borderColor: '#1A6B8A' }, borderRadius: '16px', px: 4, fontWeight: 700 }}>
                 Jadi Kreator
              </Button>
            </Stack>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600"
            sx={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '32px', border: '6px solid #FFFFFF', boxShadow: '0 20px 45px rgba(74,159,191,0.12)' }}
          />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const CommissionServices = () => (
  <Container maxWidth="xl" sx={{ py: 4 }}>
    <Typography variant="h5" fontWeight={850} sx={{ mb: 3, color: '#1A6B8A' }}>
      Commission Human Artists <span style={{ color: '#4A9FBF' }}>CreartsI+</span>
    </Typography>
    <Grid container spacing={2}>
      {vgenServices.map((service, idx) => (
        <Grid item xs={6} sm={4} md={3} key={idx}>
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card sx={{ background: service.gradient, p: 3, height: '110px', position: 'relative', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'flex-end', border: 'none', boxShadow: '0 6px 15px rgba(0,0,0,0.02)' }}>
              <Box sx={{ position: 'absolute', top: 16, right: 16, color: service.color, opacity: 0.7, '& svg': { fontSize: 30 } }}>{service.icon}</Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: service.color, lineHeight: 1.2 }}>{service.title}</Typography>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  </Container>
);

const NoAISection = () => (
  <Container maxWidth="xl" sx={{ my: 4 }}>
    <Box sx={{ background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF3E0 100%)', py: 4, px: 4, borderRadius: '24px', textAlign: 'center', border: '1px solid #FFE0B2' }}>
      <Typography variant="h5" fontWeight={800} color="#E65100" gutterBottom>No Generative AI Allowed 🚫</Typography>
      <Typography variant="body2" sx={{ maxW: '650px', mx: 'auto', color: '#6D4C41', fontWeight: 500, lineHeight: 1.6 }}>
        Kami berkomitmen penuh mendukung 100% karya otentik buatan tangan dari Seniman Nyata Indonesia.
      </Typography>
    </Box>
  </Container>
);

// ==========================================
// 3. MAIN HOMEPAGE COMPONENT
// ==========================================
function HomePage() {
  const [selectedService, setSelectedService] = useState(null);

  const handleOpenModal = (service) => setSelectedService(service);
  const handleCloseModal = () => setSelectedService(null);

  return (
    <Box sx={{ bgcolor: '#F2F7F9', minHeight: '100vh', pb: 8 }}>
      <HeroSection />
      <CommissionServices />

      {/* Grid Feed Utama */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight={850} sx={{ mb: 4, color: '#1A6B8A' }}>
          Explore Marketplace 🔥
        </Typography>

        <Grid container spacing={3}>
          {featuredCommissions.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
                <Card
                  onClick={() => handleOpenModal(item)}
                  sx={{
                    bgcolor: '#FFFFFF',
                    borderRadius: '24px',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': { borderColor: '#4A9FBF', boxShadow: '0 12px 35px rgba(74, 159, 191, 0.08)' }
                  }}
                >
                  <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden', bgcolor: '#E8F4F8' }}>
                    <Box
                      component="img"
                      src={item.images[0]}
                      alt={item.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                    />
                    <Chip label="OPEN" size="small" sx={{ position: 'absolute', top: 14, left: 14, bgcolor: '#87D37C', color: 'white', fontWeight: 800, borderRadius: '8px' }} />
                    <IconButton
                      onClick={(e) => { e.stopPropagation(); }}
                      sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(255,255,255,0.8)', color: '#1A6B8A', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: '#FFFFFF' } }}
                    >
                      <BookmarkBorderIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body1" fontWeight={750} sx={{ color: '#1C2833', mb: 1.5, lineHeight: 1.4, height: '44px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.title}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Avatar src={item.avatar} sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2" sx={{ color: '#5D6D7E', fontWeight: 600 }}>{item.artistName}</Typography>
                        <VerifiedIcon sx={{ color: '#4A9FBF', fontSize: 15 }} />
                      </Stack>
                    </Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1.5, borderTop: '1px solid rgba(74, 159, 191, 0.1)' }}>
                      <Typography variant="body1" fontWeight={800} sx={{ color: '#1A6B8A' }}>{item.price}</Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <StarIcon sx={{ color: '#FFB300', fontSize: 16 }} />
                        <Typography variant="body2" fontWeight={700} sx={{ color: '#1C2833' }}>{item.rating}</Typography>
                        <Typography variant="caption" sx={{ color: '#A6ACAF' }}>({item.reviews})</Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      <NoAISection />

      {/* Pop-up Modal Detail */}
      <Modal
        open={Boolean(selectedService)}
        onClose={handleCloseModal}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Box sx={{ outline: 'none' }}>
          {selectedService && (
            <Box
              sx={{
                position: 'relative',
                width: '92vw',
                maxWidth: '960px',
                height: { xs: '90vh', md: '80vh' },
                maxHeight: '680px',
                bgcolor: '#FFFFFF',
                borderRadius: '28px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                border: '1px solid rgba(74, 159, 191, 0.15)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.08)'
              }}
            >
              <IconButton
                onClick={handleCloseModal}
                sx={{ position: 'absolute', top: 16, left: 16, bgcolor: 'rgba(255,255,255,0.9)', color: '#1A6B8A', zIndex: 10, '&:hover': { bgcolor: '#FFFFFF' } }}
              >
                <CloseIcon />
              </IconButton>

              {/* Sisi Kiri: Gambar Sampel */}
              <Box sx={{ flex: 1.1, bgcolor: '#F4F8FA', overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {selectedService.images.map((imgUrl, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={imgUrl}
                    alt="sample"
                    sx={{ width: '100%', borderRadius: '16px', objectFit: 'contain', bgcolor: '#FFFFFF', border: '1px solid rgba(74, 159, 191, 0.1)' }}
                  />
                ))}
              </Box>

              {/* Sisi Kanan: Detail Informasi */}
              <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto', bgcolor: '#FFFFFF' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#4A9FBF', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {selectedService.category}
                  </Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ mt: 1, mb: 2, color: '#1A6B8A', lineHeight: 1.3 }}>
                    {selectedService.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#5D6D7E' }}>Starting from</Typography>
                  <Typography variant="h4" fontWeight={900} sx={{ color: '#4A9FBF', mb: 3 }}>{selectedService.price}</Typography>

                  <Typography variant="subtitle2" sx={{ color: '#1C2833', mb: 1.5, fontWeight: 700 }}>Terms & Licenses:</Typography>
                  <Stack spacing={1} sx={{ mb: 4 }}>
                    {selectedService.licenses.map((lic, idx) => (
                      <Stack direction="row" alignItems="center" spacing={1} key={idx}>
                        <CheckIcon sx={{ color: '#87D37C', fontSize: 18 }} />
                        <Typography variant="body2" sx={{ color: '#5D6D7E', fontWeight: 500 }}>{lic}</Typography>
                        <InfoIcon sx={{ color: '#BDC3C7', fontSize: 16, ml: 'auto' }} />
                      </Stack>
                    ))}
                  </Stack>

                  {/* Profil Singkat Kreator */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, bgcolor: '#F2F7F9', borderRadius: '18px', mb: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar src={selectedService.avatar} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Typography variant="subtitle2" fontWeight={750} sx={{ color: '#1C2833' }}>{selectedService.artistName} {selectedService.emoji}</Typography>
                          <VerifiedIcon sx={{ color: '#4A9FBF', fontSize: 14 }} />
                        </Stack>
                        <Typography variant="caption" sx={{ color: '#7F8C8D' }}>@kreator_lokal</Typography>
                      </Box>
                    </Stack>
                    <Button variant="contained" size="small" sx={{ bgcolor: '#FFFFFF', color: '#4A9FBF', border: '1px solid rgba(74, 159, 191, 0.2)', '&:hover': { bgcolor: '#E8F4F8' } }}>
                      Follow
                    </Button>
                  </Stack>
                </Box>

                {/* Bagian Bawah Action (Sudah Diperbaiki Pembungkusnya) */}
                <Box>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Button variant="contained" fullWidth sx={{ bgcolor: '#4A9FBF', color: 'white', fontWeight: 700, py: 1.5, borderRadius: '14px', '&:hover': { bgcolor: '#1A6B8A' } }}>
                      Ajukan Permintaan Komisi
                    </Button>
                    <IconButton sx={{ border: '1px solid rgba(74, 159, 191, 0.2)', color: '#4A9FBF', borderRadius: '14px' }}>
                      <ChatBubbleOutlineIcon />
                    </IconButton>
                  </Stack>
                </Box> {/* <-- Di sini penutup Box yang bener */}

              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default HomePage;