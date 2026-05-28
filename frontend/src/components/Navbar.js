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
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(26, 107, 138, 0.15)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1A6B8A 0%, #4A9FBF 50%, #FFA500 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  fontSize: '1.6rem',
  letterSpacing: '-0.5px',
}));

const NavButton = styled(Button)(({ theme }) => ({
  borderRadius: '40px',
  padding: '8px 20px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  color: '#1A6B8A',
  '&:hover': {
    backgroundColor: 'rgba(26, 107, 138, 0.08)',
  },
}));

const JoinButton = styled(Button)(({ theme }) => ({
  borderRadius: '40px',
  padding: '8px 28px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #1A6B8A 0%, #4A9FBF 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #0B4A63 0%, #1A6B8A 100%)',
    transform: 'translateY(-2px)',
  },
  transition: 'transform 0.2s',
}));

function Navbar({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
    { label: 'Explore', path: '/artists' },
    { label: 'Tentang', path: '/about' },
    { label: 'Untuk Seniman', path: '/for-artists' },
  ];

  return (
    <StyledAppBar position="sticky" color="transparent" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1, px: { xs: 0, md: 2 } }}>
          <LogoContainer onClick={() => navigate('/')}>
            <span style={{ fontSize: '28px' }}></span>
            <LogoText variant="h6">
              <span style={{ color: '#1A6B8A', WebkitTextFillColor: '#1A6B8A' }}>Krearts</span>
              <span style={{ color: '#FFA500', WebkitTextFillColor: '#FFA500' }}>I</span>
            </LogoText>
          </LogoContainer>

          {!isMobile ? (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <NavButton key={item.label} component={Link} to={item.path}>
                  {item.label}
                </NavButton>
              ))}

              {!isAuthenticated ? (
                <>
                  <NavButton component={Link} to="/login">
                    Masuk
                  </NavButton>
                  <JoinButton component={Link} to="/register">
                    Sign up
                  </JoinButton>
                </>
              ) : (
                <>
                  <JoinButton component={Link} to="/dashboard">
                    Dashboard
                  </JoinButton>
                  <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                    <Avatar sx={{ bgcolor: '#FFA500' }}>
                      {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{ sx: { borderRadius: 4, mt: 1, minWidth: 180 } }}
                  >
                    <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                      Profil Saya
                    </MenuItem>
                    <MenuItem component={Link} to="/my-commissions" onClick={handleMenuClose}>
                      Komisi Saya
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Keluar</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          ) : (
            <IconButton onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, p: 2, bgcolor: '#E8F4F8', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={() => setMobileOpen(false)}>
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
                sx={{ borderRadius: 2, mb: 1 }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            {!isAuthenticated ? (
              <>
                <ListItem button component={Link} to="/login" onClick={() => setMobileOpen(false)} sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText primary="Masuk" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  sx={{ borderRadius: 2, bgcolor: '#1A6B8A', color: 'white', '&:hover': { bgcolor: '#0B4A63' } }}
                >
                  <ListItemText primary="Bergabung 🐾" />
                </ListItem>
              </>
            ) : (
              <ListItem button onClick={handleLogout} sx={{ borderRadius: 2 }}>
                <ListItemText primary="Keluar" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </StyledAppBar>
  );
}

export default Navbar;