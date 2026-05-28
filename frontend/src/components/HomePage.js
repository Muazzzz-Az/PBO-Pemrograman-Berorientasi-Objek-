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

// Perbaikan Import: Menggunakan path ikon yang valid dan aman dari error build
import {
  MusicNote,
  Palette,
  TheaterComedy,
  CameraAlt,
  Brush,
  Celebration,
  Layers,
  ContentPaste,
  Create,
  AutoAwesome,
  VideoCameraBack,
  CardGiftcard,
  InfoOutlined as InfoIcon,
  ChatBubbleOutlineOutlined as ChatBubbleOutlineIcon
} from '@mui/icons-material';

// ==========================================
// 1. MOCK DATA KARYA / KOMISI
// ==========================================
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
    images: [
    ],
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
    images: [

    ],
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
    images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600'
    ],
    licenses: ['Personal Use Only']
  }
];

const vgenServices = [
  { title: 'Illustrations', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', icon: <Palette /> },
  { title: '2D Avatars', gradient: 'linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)', icon: <Layers /> },
  { title: '3D Models', gradient: 'linear-gradient(135deg, #00CEC9 0%, #00B894 100%)', icon: <AutoAwesome /> },
  { title: 'Emotes + Badges', gradient: 'linear-gradient(135deg, #FFEAA7 0%, #FFD32A 100%)', icon: <Create /> },
  { title: 'Stream Assets', gradient: 'linear-gradient(135deg, #FF7675 0%, #D63031 100%)', icon: <VideoCameraBack /> },
  { title: 'Branding + Graphics', gradient: 'linear-gradient(135deg, #74B9FF 0%, #0984E3 100%)', icon: <ContentPaste /> },
  { title: 'Animation + Videos', gradient: 'linear-gradient(135deg, #E84393 0%, #FD79A8 100%)', icon: <VideoCameraBack /> },
];

// ==========================================
// 2. SUB-KOMPONEN LAYOUT UTAMA
// ==========================================

const HeroSection = () => (
  <Box sx={{ minHeight: '75vh', background: 'linear-gradient(135deg, #0B4A63 0%, #1A6B8A 40%, #222126 100%)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
    <Container maxWidth="xl" sx={{ py: { xs: 8, md: 4 }, zIndex: 2 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={7}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Chip
              label="For the love of human creativity 🇮🇩"
              sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#93E945', fontWeight: 600, border: '1px solid rgba(147,233,69,0.3)', backdropFilter: 'blur(10px)', mb: 3, px: 1 }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', md: '4rem' }, fontWeight: 900, color: 'white', mb: 2, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Made for <span style={{ color: '#93E945' }}>Indonesian Creators</span><br />
              <span style={{ fontSize: '2rem', fontWeight: 600, color: '#DDD' }}>di CreartsI dengan cinta ❤️</span>
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 5, fontWeight: 400, maxW: '600px', lineHeight: 1.5 }}>
              Rumah komisi terbaik untuk VTubing, streaming, ilustrasi, musik, game, dan petualangan konten kreator asli Indonesia!
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component={Link} to="/artists" variant="contained" size="large" sx={{ bgcolor: '#93E945', color: '#16151A', '&:hover': { bgcolor: '#A3F955' }, borderRadius: '14px', px: 4, py: 1.8, fontWeight: 800, textTransform: 'none', fontSize: '1.05rem' }}>
                🎨 Jelajahi Seniman <ArrowForwardIcon sx={{ ml: 1 }} />
              </Button>
              <Button component={Link} to="/register" variant="outlined" size="large" sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'white' }, borderRadius: '14px', px: 4, textTransform: 'none' }}>
                 Jadi Kreator
              </Button>
            </Stack>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600"
            sx={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}
          />
        </Grid>
      </Grid>
    </Container>
    <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to top, #16151A, transparent)', zIndex: 1 }} />
  </Box>
);

const CommissionServices = () => (
  <Container maxWidth="xl" sx={{ py: 6 }}>
    <Typography variant="h5" fontWeight={800} sx={{ mb: 3, color: 'white', letterSpacing: '-0.01em' }}>
      Commission Human Artists <span style={{ color: '#93E945' }}>CreartsI+</span>
    </Typography>
    <Grid container spacing={2}>
      {vgenServices.map((service, idx) => (
        <Grid item xs={6} sm={4} md={3} key={idx}>
          <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card sx={{ background: service.gradient, color: 'white', p: 3, height: '110px', position: 'relative', borderRadius: '18px', cursor: 'pointer', display: 'flex', alignItems: 'flex-end', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
              <Box sx={{ position: 'absolute', top: 16, right: 16, opacity: 0.25, '& svg': { fontSize: 32 } }}>{service.icon}</Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>{service.title}</Typography>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  </Container>
);

const NoAISection = () => (
  <Container maxWidth="xl" sx={{ my: 4 }}>
    <Box sx={{ background: 'linear-gradient(90deg, #2A1F1A 0%, #222126 100%)', py: 5, px: 4, borderRadius: '24px', textAlign: 'center', border: '1px solid #422519' }}>
      <Typography variant="h4" fontWeight={800} color="#FF8E53" gutterBottom sx={{ letterSpacing: '-0.02em' }}>No Generative AI Allowed 🚫</Typography>
      <Typography variant="body1" sx={{ maxW: '750px', mx: 'auto', color: '#BBB', lineHeight: 1.6 }}>
        Kami berkomitmen mendukung 100% karya Seniman Nyata Indonesia.
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
    <Box sx={{ bgcolor: '#16151A', minHeight: '100vh', color: '#F5F5F7', pb: 8 }}>
      <HeroSection />

      {/* Grid Kategori Atas VGen banner */}
      <CommissionServices />

      {/* Bagian Feed Kartu Produk / Galeri Komisi */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 4, color: 'white', letterSpacing: '-0.01em' }}>
          Explore Marketplace 🔥
        </Typography>

        <Grid container spacing={3}>
          {featuredCommissions.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
                <Card
                  onClick={() => handleOpenModal(item)}
                  sx={{
                    bgcolor: '#222126',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    border: '1px solid #333238',
                    color: 'white',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { borderColor: '#44434B' }
                  }}
                >
                  <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden' }}>
                    <Box
                      component="img"
                      src={item.images[0]}
                      alt={item.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                    />
                    <Chip label="OPEN" size="small" sx={{ position: 'absolute', top: 14, left: 14, bgcolor: '#93E945', color: '#000', fontWeight: 800, borderRadius: '6px', height: '22px', fontSize: '11px' }} />
                    <IconButton
                      onClick={(e) => { e.stopPropagation(); }} // Agar tidak trigger modal buka saat klik bookmark
                      sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                    >
                      <BookmarkBorderIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body1" fontWeight={700} sx={{ mb: 1.5, lineHeight: 1.3, height: '42px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.title}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Avatar src={item.avatar} sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2" sx={{ color: '#BBB', fontWeight: 500, noWrap: true }}>{item.artistName}</Typography>
                        <VerifiedIcon sx={{ color: '#4A9FBF', fontSize: 15 }} />
                      </Stack>
                    </Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1, borderTop: '1px solid #333238' }}>
                      <Typography variant="body1" fontWeight={800} sx={{ color: '#93E945' }}>{item.price}</Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <StarIcon sx={{ color: '#FFD700', fontSize: 16 }} />
                        <Typography variant="body2" fontWeight={700}>{item.rating}</Typography>
                        <Typography variant="caption" sx={{ color: '#777' }}>({item.reviews})</Typography>
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

      {/* ==========================================
          4. MODAL DETIL POP-UP
         ========================================== */}
<Modal
  open={Boolean(selectedService)}
  onClose={handleCloseModal}
  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 1, sm: 2 } }}
>
  {/* KUNCI PERBAIKAN:
    Bungkus dengan <Box> utama terlebih dahulu, atau pastikan pembacaan kondisi
    berada di dalam elemen pembungkus tunggal agar MUI tidak membaca nilai 'null'.
  */}
  <Box sx={{ outline: 'none' }}>
    {selectedService && (
      <Box
        sx={{
          position: 'relative',
          width: '95vw',
          maxWidth: '1000px',
          height: { xs: '95vh', md: '85vh' },
          maxHeight: '720px',
          bgcolor: '#1F1E24',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          border: '1px solid #333238'
        }}
      >
        {/* Tombol Close Pojok Kiri Atas Transparan */}
        <IconButton
          onClick={handleCloseModal}
          sx={{ position: 'absolute', top: 16, left: 16, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', zIndex: 10, backdropFilter: 'blur(4px)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
        >
          <CloseIcon />
        </IconButton>


        <Box
          sx={{
            flex: 1.1,
            bgcolor: '#131216',
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#333238', borderRadius: '4px' }
          }}
        >
          {selectedService.images.map((imgUrl, i) => (
            <Box
              key={i}
              component="img"
              src={imgUrl}
              alt={`work-sample-${i}`}
              sx={{ width: '100%', borderRadius: '14px', objectFit: 'contain', bgcolor: '#1F1E24', border: '1px solid #2A2930' }}
            />
          ))}
        </Box>

        {/* SISI KANAN: Informasi Detail & Dokumen Transaksi Pembelian */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
            color: 'white',
            bgcolor: '#1F1E24',
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#2A2930', borderRadius: '4px' }
          }}
        >
          {/* Bagian Konten Atas */}
          <Box>
            <Typography variant="caption" sx={{ color: '#93E945', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5 }}>
              {selectedService.category}
            </Typography>

            <Typography variant="h5" fontWeight={800} sx={{ mt: 1, mb: 2, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
              {selectedService.title}
            </Typography>

            <Typography variant="body2" sx={{ color: '#888', mb: 0.5 }}>
              Starting from
            </Typography>
            <Typography variant="h4" fontWeight={900} sx={{ color: '#93E945', mb: 3, letterSpacing: '-0.02em' }}>
              {selectedService.price}
            </Typography>

            {/* List Aturan Lisensi */}
            <Typography variant="subtitle2" sx={{ color: '#FFF', mb: 1.5, fontWeight: 700 }}>Terms & Licenses:</Typography>
            <Stack spacing={1.2} sx={{ mb: 4 }}>
              {selectedService.licenses.map((lic, idx) => (
                <Stack direction="row" alignItems="center" spacing={1.2} key={idx}>
                  <CheckIcon sx={{ color: '#93E945', fontSize: 16 }} />
                  <Typography variant="body2" fontWeight={500} sx={{ color: '#DDD' }}>{lic}</Typography>
                  <InfoIcon sx={{ color: '#555', fontSize: 16, cursor: 'pointer', '&:hover': { color: '#888' } }} />
                </Stack>
              ))}
            </Stack>

            {/* Barisan Akun Seniman Pembuat */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, bgcolor: '#16151A', borderRadius: '16px', border: '1px solid #2A2930', mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar src={selectedService.avatar} sx={{ width: 44, height: 44, border: '2px solid #333' }} />
                <Box>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle2" fontWeight={700}>{selectedService.artistName} {selectedService.emoji}</Typography>
                    <VerifiedIcon sx={{ color: '#4A9FBF', fontSize: 14 }} />
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#666' }}>@kreator_lokal</Typography>
                </Box>
              </Stack>
              <Button variant="contained" size="small" sx={{ bgcolor: '#2A2930', color: 'white', textTransform: 'none', borderRadius: '10px', px: 2, fontWeight: 600, border: '1px solid #333', '&:hover': { bgcolor: '#3A3940' } }}>
                Follow
                  </Button>
            </Stack>

            {/* Teks Catatan Singkat Syarat Layanan */}
            <Typography variant="body2" sx={{ color: '#A0A0A5', bgcolor: 'rgba(255,255,255,0.02)', p: 2, borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              "Terima kasih telah meninjau komisi ini! Harap baca syarat & ketentuan pengerjaan art di profil saya sebelum mengirimkan pesanan ya kak."
            </Typography>
          </Box>

          {/* Bagian Bawah: Tombol Action Ajukan Order & Opsi Pembayaran Digital */}
          <Box sx={{ mt: 4 }}>
            <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#93E945', color: '#16151A', fontWeight: 800, textTransform: 'none', py: 1.6, borderRadius: '14px', fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(147,233,69,0.2)', '&:hover': { bgcolor: '#A3F955' } }}
              >
                Accept terms to start request
              </Button>
              <IconButton sx={{ border: '1px solid #333238', color: 'white', borderRadius: '14px', px: 2, '&:hover': { bgcolor: '#222126' } }}>
                <ChatBubbleOutlineIcon />
              </IconButton>
            </Stack>

            {/* Label Brand Dompet Digital Indonesia */}
            <Stack direction="row" alignItems="center" spacing={1.2} justifyContent="center" sx={{ opacity: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', letterSpacing: 0.5 }}>Accepts:</Typography>
              <Chip label="QRIS" size="small" sx={{ bgcolor: '#16151A', color: '#DDD', fontSize: '10px', height: 18, fontWeight: 600, border: '1px solid #333' }} />
              <Chip label="GoPay" size="small" sx={{ bgcolor: '#16151A', color: '#DDD', fontSize: '10px', height: 18, fontWeight: 600, border: '1px solid #333' }} />
              <Chip label="OVO" size="small" sx={{ bgcolor: '#16151A', color: '#DDD', fontSize: '10px', height: 18, fontWeight: 600, border: '1px solid #333' }} />
              <Chip label="Dana" size="small" sx={{ bgcolor: '#16151A', color: '#DDD', fontSize: '10px', height: 18, fontWeight: 600, border: '1px solid #333' }} />
            </Stack>
          </Box>

        </Box>
      </Box>
    )}
  </Box>
</Modal>

    </Box>
  );
}

export default HomePage;