import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Badge,
  Divider,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: '#FFFFFF',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(74, 159, 191, 0.12)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  color: '#1A6B8A',
  fontWeight: 900,
  fontSize: '1.5rem',
  letterSpacing: '-0.5px',
  fontFamily: '"Plus Jakarta Sans", sans-serif',
}));

const NavButton = styled(Button)(({ theme }) => ({
  borderRadius: '40px',
  padding: '6px 16px',
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: '#5D6D7E',
  '&:hover': {
    color: '#4A9FBF',
    backgroundColor: 'rgba(74, 159, 191, 0.05)',
  },
}));

const ArtistButton = styled(Button)(({ theme }) => ({
  borderRadius: '40px',
  padding: '6px 18px',
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 600,
  backgroundColor: '#FFFFFF',
  color: '#4A9FBF',
  border: '1px solid rgba(74, 159, 191, 0.3)',
  '&:hover': {
    backgroundColor: '#F2F7F9',
    borderColor: '#4A9FBF',
  },
}));

// --- STYLING BARU UNTUK TOMBOL SUB-KATEGORI ---
const CategoryButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#5D6D7E',
  padding: '4px 12px',
  whiteSpace: 'nowrap',
  '&:hover': {
    color: '#4A9FBF',
    backgroundColor: 'transparent',
  },
}));

function Navbar({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // State untuk dropdown lonceng
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [hasNewNotif, setHasNewNotif] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const location = useLocation();

  // --- LOGIKA TOGGLE SUB-NAVBAR KATEGORI ---
  const [showCategories, setShowCategories] = useState(false);

  // Pantau rute jalan: kalau bukan di rute /category, paksa sembunyikan baris kategori
  useEffect(() => {
    if (location.pathname.includes('/category')) {
      setShowCategories(true);
    } else {
      setShowCategories(false);
      localStorage.removeItem('showNavbarCategories');
    }
  }, [location]);

  useEffect(() => {
    const handleCategoryEvent = () => {
      setShowCategories(true);
    };
    window.addEventListener('categoryClicked', handleCategoryEvent);
    return () => window.removeEventListener('categoryClicked', handleCategoryEvent);
  }, []);

  // Handler khusus klik logo / balik ke home untuk reset state bar kategori
  const handleGoHome = () => {
    localStorage.removeItem('showNavbarCategories');
    setShowCategories(false);
    navigate('/');
  };

  // Cek apakah ada notifikasi persetujuan artist di localStorage
  useEffect(() => {
    const checkNotif = () => {
      if (isAuthenticated) {
        const notifData = localStorage.getItem('artist_notification');
        if (notifData) {
          setHasNewNotif(true);
        }
      }
    };
    checkNotif();
    window.addEventListener('storage', checkNotif);
    return () => window.removeEventListener('storage', checkNotif);
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('artist_notification');
    localStorage.removeItem('showNavbarCategories');
    setIsAuthenticated(false);
    setUser(null);
    setAnchorEl(null);
    setHasNewNotif(false);
    navigate('/');
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNotifOpen = (event) => setAnchorElNotif(event.currentTarget);
  const handleNotifClose = () => setAnchorElNotif(null);

  // Klik notifikasi untuk menghapus titik merah/badge lonceng
  const handleClearNotif = () => {
    localStorage.removeItem('artist_notification');
    setHasNewNotif(false);
    handleNotifClose();
  };

  const menuItems = [
    { label: 'Commission', path: '/artists' },
    { label: 'Shop', path: '/shop' }
  ];

  // --- DATA KATEGORI YANG AKAN DITAMPILKAN PADA GARIS KEDUA ---
  const categories = [
    { label: 'Illustrations', path: '/category/illustrations' },
    { label: '2D Avatars', path: '/category/2d-avatars' },
    { label: '3D Models', path: '/category/3d-models' },
    { label: 'Emotes + Badges', path: '/category/emotes-badges' },
    { label: 'Stream Assets', path: '/category/stream-assets' },
    { label: 'Branding + Graphics', path: '/category/branding-graphics' },
    { label: 'Animation + Videos', path: '/category/animation-videos' }
  ];

  return (
    <StyledAppBar position="sticky" color="transparent" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 0.8, px: { xs: 0, md: 1 } }}>

          {/* Sisi Kiri: Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <LogoContainer onClick={handleGoHome}>
              <LogoText variant="h6">
                Crearts<span style={{ color: '#4A9FBF' }}>I</span>
              </LogoText>
            </LogoContainer>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {menuItems.map((item) => (
                  <NavButton key={item.label} component={Link} to={item.path} onClick={() => {
                    localStorage.removeItem('showNavbarCategories');
                    setShowCategories(false);
                  }}>
                    {item.label}
                  </NavButton>
                ))}
              </Box>
            )}
          </Box>

          {/* Sisi Kanan: Actions */}
          {!isMobile ? (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>

              {/* Lonceng bawaanmu dengan badge titik merah minimalis */}
              {isAuthenticated && (
                <Tooltip title="Pemberitahuan">
                  <IconButton
                    onClick={handleNotifOpen}
                    sx={{ color: '#5D6D7E', p: 1, '&:hover': { bgcolor: '#F2F7F9', color: '#4A9FBF' } }}
                  >
                    <Badge color="error" variant="dot" invisible={!hasNewNotif} overlap="circular">
                      <NotificationsNoneIcon sx={{ width: 24, height: 24 }} />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}

              {/* Dropdown Menu Teks Notifikasi Simpel */}
              <Menu
                anchorEl={anchorElNotif}
                open={Boolean(anchorElNotif)}
                onClose={handleNotifClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    borderRadius: 4,
                    mt: 1.5,
                    width: 260,
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(74, 159, 191, 0.15)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                  }
                }}
              >
                <Box px={2} py={1}>
                  <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A">Pemberitahuan</Typography>
                </Box>
                <Divider />
                {!hasNewNotif ? (
                  <Box p={2} textAlign="center">
                    <Typography variant="body2" color="textSecondary">Tidak ada notifikasi baru</Typography>
                  </Box>
                ) : (
                  <MenuItem onClick={handleClearNotif} sx={{ py: 1.5, whiteSpace: 'normal' }}>
                    <Typography variant="body2" sx={{ color: '#2C3E50', fontWeight: 600 }}>
                      🎉 Verifikasi Kreator berhasil
                    </Typography>
                  </MenuItem>
                )}
              </Menu>

              {/* Tombol Artist */}
              <ArtistButton component={Link} to="/for-artists">
                I'm an artist+
              </ArtistButton>

              {/* Tombol Profile / Dropdown */}
              <Box>
                {!isAuthenticated ? (
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{ color: '#4A9FBF', p: 0.5, border: '1px solid rgba(74, 159, 191, 0.2)', '&:hover': { bgcolor: '#F2F7F9' } }}
                  >
                    <AccountCircleIcon sx={{ width: 32, height: 32 }} />
                  </IconButton>
                ) : (
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0.5, border: '1px solid rgba(74, 159, 191, 0.2)' }}>
                    <Avatar sx={{ bgcolor: '#4A9FBF', color: '#FFFFFF', width: 32, height: 32, fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
                    </Avatar>
                  </IconButton>
                )}

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: {
                      borderRadius: 4,
                      mt: 1.5,
                      minWidth: 190,
                      bgcolor: '#FFFFFF',
                      border: '1px solid rgba(74, 159, 191, 0.15)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  {isAuthenticated ? (
                    <Box>
                      <MenuItem component={Link} to="/profile" onClick={handleMenuClose} sx={{ fontSize: '0.9rem', fontWeight: 500, '&:hover': { bgcolor: '#F2F7F9', color: '#4A9FBF' } }}>
                        Profile
                      </MenuItem>
                      <MenuItem component={Link} to="/messages" onClick={handleMenuClose} sx={{ fontSize: '0.9rem', fontWeight: 500, '&:hover': { bgcolor: '#F2F7F9', color: '#4A9FBF' } }}>
                        💬 Kotak Chat
                      </MenuItem>
                      <MenuItem component={Link} to="/cart" onClick={handleMenuClose} sx={{ fontSize: '0.9rem', fontWeight: 500, '&:hover': { bgcolor: '#F2F7F9', color: '#4A9FBF' } }}>
                        🛍️ Keranjang Belanja
                      </MenuItem>
                      <MenuItem component={Link} to="/my-commissions" onClick={handleMenuClose} sx={{ fontSize: '0.9rem', fontWeight: 500, '&:hover': { bgcolor: '#F2F7F9', color: '#4A9FBF' } }}>
                        🎨 Komisi Saya
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout} sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#E74C3C', '&:hover': { bgcolor: '#FCE4EC' } }}>
                        Log out
                      </MenuItem>
                    </Box>
                  ) : (
                    <Box>
                      <MenuItem onClick={() => { navigate('/login'); handleMenuClose(); }} sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1A6B8A', '&:hover': { bgcolor: '#F2F7F9' } }}>
                        Login
                      </MenuItem>
                      <MenuItem onClick={() => { navigate('/register'); handleMenuClose(); }} sx={{ fontSize: '0.9rem', fontWeight: 500, '&:hover': { bgcolor: '#F2F7F9' } }}>
                        Sign Up
                      </MenuItem>
                    </Box>
                  )}
                </Menu>
              </Box>

            </Box>
          ) : (
            /* Versi Mobile Menu */
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAuthenticated && (
                <IconButton onClick={handleNotifOpen} sx={{ color: '#5D6D7E' }}>
                  <Badge color="error" variant="dot" invisible={!hasNewNotif}>
                    <NotificationsNoneIcon />
                  </Badge>
                </IconButton>
              )}
              <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#1A6B8A' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>

        {/* --- DI SINI GARIS KEDUA SUB-NAVBAR KATEGORI (MUNCUL JIKA KONDISI TRUE) --- */}
        {!isMobile && showCategories && (
          <Box sx={{
            display: 'flex',
            gap: 1,
            py: 1,
            borderTop: '1px solid rgba(74, 159, 191, 0.08)',
            overflowX: 'auto',
            justifyContent: 'flex-start'
          }}>
            {categories.map((cat) => (
              <CategoryButton key={cat.label} component={Link} to={cat.path}>
                {cat.label}
              </CategoryButton>
            ))}
          </Box>
        )}
      </Container>

      {/* Drawer Mobile View */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, p: 2, bgcolor: '#FFFFFF', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#1A6B8A' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.label}
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{ borderRadius: 2, mb: 1, color: '#5D6D7E', '&:hover': { color: '#4A9FBF', bgcolor: '#F2F7F9' } }}
              >
                <ListItemText primary={item.label} sx={{ primaryTypographyProps: { fontWeight: 600 } }} />
              </ListItem>
            ))}

            {/* --- INTEGRASI SUB-MENU KATEGORI PADA MOBILE DRAWERS --- */}
            {showCategories && (
              <>
                <Divider sx={{ my: 1 }} />
                <Box px={2} py={0.5}>
                  <Typography variant="caption" fontWeight={700} color="rgba(74, 159, 191, 0.6)">CATEGORIES</Typography>
                </Box>
                {categories.map((cat) => (
                  <ListItem
                    button
                    key={cat.label}
                    component={Link}
                    to={cat.path}
                    onClick={() => setMobileOpen(false)}
                    sx={{ borderRadius: 2, mb: 0.5, color: '#5D6D7E', pl: 3, '&:hover': { color: '#4A9FBF', bgcolor: '#F2F7F9' } }}
                  >
                    <ListItemText primary={cat.label} sx={{ primaryTypographyProps: { fontSize: '0.9rem', fontWeight: 500 } }} />
                  </ListItem>
                ))}
              </>
            )}
            <Divider sx={{ my: 1 }} />

            {isAuthenticated && (
              <ListItem button onClick={handleLogout} sx={{ borderRadius: 2, color: '#E74C3C', '&:hover': { bgcolor: '#FCE4EC' } }}>
                <ListItemText primary="Keluar" sx={{ primaryTypographyProps: { fontWeight: 600 } }} />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </StyledAppBar>
  );
}

export default Navbar;