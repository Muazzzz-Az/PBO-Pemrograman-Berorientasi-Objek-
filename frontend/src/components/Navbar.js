import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icon untuk user yang belum login
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

function Navbar({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: 'Commission', path: '/artists' },
    { label: 'Shop', path: '/shop' },
    { label: 'Challenge', path: '/challenge' },
  ];

  return (
    <StyledAppBar position="sticky" color="transparent" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 0.8, px: { xs: 0, md: 1 } }}>

          {/* Sisi Kiri: Logo & Navigasi Utama */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <LogoContainer onClick={() => navigate('/')}>
              <LogoText variant="h6">
                Crearts<span style={{ color: '#4A9FBF' }}>I</span>
              </LogoText>
            </LogoContainer>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {menuItems.map((item) => (
                  <NavButton key={item.label} component={Link} to={item.path}>
                    {item.label}
                  </NavButton>
                ))}
              </Box>
            )}
          </Box>

          {/* Sisi Kanan: Actions Menjadi Bersih & Ringkas */}
          {!isMobile ? (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>

              {/* Tombol Khusus untuk Mengajak Seniman Bergabung */}
              <ArtistButton component={Link} to="/for-artists">
                I'm an artist+
              </ArtistButton>

              {!isAuthenticated ? (
                /* JIKA BELUM LOGIN: Hanya tampil satu Icon Logo di Pojok */
                <IconButton
                  onClick={() => navigate('/login')}
                  sx={{ color: '#4A9FBF', p: 0.5, border: '1px solid rgba(74, 159, 191, 0.2)', '&:hover': { bgcolor: '#F2F7F9' } }}
                >
                  <AccountCircleIcon sx={{ width: 32, height: 32 }} />
                </IconButton>
              ) : (
                /* JIKA SUDAH LOGIN: Tampilkan Avatar Inisial Nama */
                <>
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0.5, border: '1px solid rgba(74, 159, 191, 0.2)' }}>
                    <Avatar sx={{ bgcolor: '#4A9FBF', color: '#FFFFFF', width: 32, height: 32, fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
                    </Avatar>
                  </IconButton>
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
                        minWidth: 180,
                        bgcolor: '#FFFFFF',
                        border: '1px solid rgba(74, 159, 191, 0.15)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    <MenuItem component={Link} to="/profile" onClick={handleMenuClose} sx={{ fontWeight: 500, '&:hover': { bgcolor: '#F2F7F9', color: '#4A9FBF' } }}>
                      Profil Saya
                    </MenuItem>
                    <MenuItem component={Link} to="/my-commissions" onClick={handleMenuClose} sx={{ fontWeight: 500, '&:hover': { bgcolor: '#F2F7F9', color: '#4A9FBF' } }}>
                      Komisi Saya
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ fontWeight: 600, color: '#E74C3C', '&:hover': { bgcolor: '#FCE4EC' } }}>
                      Keluar
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          ) : (
            /* Versi Mobile Menu */
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isAuthenticated && (
                <IconButton onClick={() => navigate('/login')} sx={{ color: '#4A9FBF' }}>
                  <AccountCircleIcon sx={{ width: 28, height: 28 }} />
                </IconButton>
              )}
              <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#1A6B8A' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
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