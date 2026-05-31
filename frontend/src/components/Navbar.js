
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
import { cartService } from '../services/RealTimeDataService';

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
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const location = useLocation();
  const [showCategories, setShowCategories] = useState(false);

  // Load cart count
  useEffect(() => {
    if (user) {
      const cart = cartService.getCart();
      const userCart = cart.filter(item => item.userId === user.id);
      setCartCount(userCart.length);
    }
  }, [user]);

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

  // Load notifications from localStorage
  useEffect(() => {
    const loadNotifications = () => {
      const savedNotifications = JSON.parse(localStorage.getItem('user_notifications')) || [];
      setNotifications(savedNotifications);
      const unread = savedNotifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    };

    loadNotifications();

    const handleStorageChange = (e) => {
      if (e.key === 'user_notifications') {
        loadNotifications();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check for artist verification notification
  useEffect(() => {
    const checkArtistNotification = () => {
      const notifData = localStorage.getItem('artist_notification');
      if (notifData && isAuthenticated) {
        const existingNotifs = JSON.parse(localStorage.getItem('user_notifications')) || [];
        const alreadyExists = existingNotifs.some(n => n.message === notifData);

        if (!alreadyExists) {
          const newNotification = {
            id: Date.now(),
            message: notifData,
            type: 'ARTIST_APPROVAL',
            isRead: false,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          const updatedNotifs = [newNotification, ...existingNotifs];
          localStorage.setItem('user_notifications', JSON.stringify(updatedNotifs));
          setNotifications(updatedNotifs);
          setUnreadCount(prev => prev + 1);
        }
        localStorage.removeItem('artist_notification');
      }
    };

    checkArtistNotification();
  }, [isAuthenticated]);

  const handleGoHome = () => {
    localStorage.removeItem('showNavbarCategories');
    setShowCategories(false);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('artist_notification');
    localStorage.removeItem('showNavbarCategories');
    setIsAuthenticated(false);
    setUser(null);
    setAnchorEl(null);
    navigate('/');
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNotifOpen = (event) => setAnchorElNotif(event.currentTarget);
  const handleNotifClose = () => setAnchorElNotif(null);

  const handleMarkAsRead = (notifId) => {
    const updatedNotifs = notifications.map(notif =>
      notif.id === notifId ? { ...notif, isRead: true } : notif
    );
    localStorage.setItem('user_notifications', JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs);
    const unread = updatedNotifs.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifs = notifications.map(notif => ({ ...notif, isRead: true }));
    localStorage.setItem('user_notifications', JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs);
    setUnreadCount(0);
  };

  const handleClearNotification = (notifId) => {
    const updatedNotifs = notifications.filter(n => n.id !== notifId);
    localStorage.setItem('user_notifications', JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs);
    const unread = updatedNotifs.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  };

  const menuItems = [
    { label: 'Commission', path: '/artists' },
    { label: 'Shop', path: '/shop' }
  ];

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

          {/* Left Side: Logo */}
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

          {/* Right Side: Actions */}
          {!isMobile ? (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>

              {/* Bell Icon */}
              {isAuthenticated && (
                <Tooltip title="Notifications">
                  <IconButton
                    onClick={handleNotifOpen}
                    sx={{ color: '#5D6D7E', p: 1, '&:hover': { bgcolor: '#F2F7F9', color: '#4A9FBF' } }}
                  >
                    <Badge badgeContent={unreadCount} color="error" overlap="circular">
                      <NotificationsNoneIcon sx={{ width: 24, height: 24 }} />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}

              {/* Notifications Menu */}
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
                    width: 320,
                    maxHeight: 400,
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(74, 159, 191, 0.15)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                  }
                }}
              >
                <Box px={2} py={1.5} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A">
                    Notifications
                  </Typography>
                  {notifications.length > 0 && unreadCount > 0 && (
                    <Button size="small" onClick={handleMarkAllAsRead} sx={{ textTransform: 'none', fontSize: '0.7rem' }}>
                      Mark all as read
                    </Button>
                  )}
                </Box>
                <Divider />

                {notifications.length === 0 ? (
                  <Box p={3} textAlign="center">
                    <Typography variant="body2" color="textSecondary">No notifications yet</Typography>
                  </Box>
                ) : (
                  <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
                    {notifications.map((notif) => (
                      <MenuItem
                        key={notif.id}
                        onClick={() => handleMarkAsRead(notif.id)}
                        sx={{
                          py: 1.5,
                          px: 2,
                          whiteSpace: 'normal',
                          backgroundColor: notif.isRead ? 'transparent' : '#F0F9FF',
                          borderBottom: '1px solid #F1F5F9',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: 0.5
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" width="100%">
                          <Typography variant="body2" sx={{ fontWeight: notif.isRead ? 400 : 600, color: '#2C3E50' }}>
                            {notif.type === 'ARTIST_APPROVAL' ? '🎉 Artist Verification' : '📢 Notification'}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleClearNotification(notif.id); }}
                            sx={{ p: 0.5 }}
                          >
                            <CloseIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#475569', pr: 3 }}>
                          {notif.message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                          {notif.timestamp}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Box>
                )}
              </Menu>

              {/* Artist Button */}
              <ArtistButton component={Link} to="/for-artists">
                I'm an artist+
              </ArtistButton>

              {/* Profile Dropdown */}
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
                      <MenuItem component={Link} to="/profile" onClick={handleMenuClose} sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        Profile
                      </MenuItem>
                      <MenuItem component={Link} to="/messages" onClick={handleMenuClose} sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        💬 Messages
                      </MenuItem>
                      <MenuItem component={Link} to="/cart" onClick={handleMenuClose} sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        🛍️ Cart {cartCount > 0 && `(${cartCount})`}
                      </MenuItem>
                      <MenuItem component={Link} to="/my-commissions" onClick={handleMenuClose} sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        🎨 My Commissions
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout} sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#E74C3C' }}>
                        Log out
                      </MenuItem>
                    </Box>
                  ) : (
                    <Box>
                      <MenuItem onClick={() => { navigate('/login'); handleMenuClose(); }} sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1A6B8A' }}>
                        Login
                      </MenuItem>
                      <MenuItem onClick={() => { navigate('/register'); handleMenuClose(); }} sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        Sign Up
                      </MenuItem>
                    </Box>
                  )}
                </Menu>
              </Box>
            </Box>
          ) : (
            /* Mobile Menu */
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAuthenticated && (
                <IconButton onClick={handleNotifOpen} sx={{ color: '#5D6D7E' }}>
                  <Badge badgeContent={unreadCount} color="error">
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

        {/* Category Sub-navbar */}
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

      {/* Mobile Drawer */}
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
                sx={{ borderRadius: 2, mb: 1, color: '#5D6D7E' }}
              >
                <ListItemText primary={item.label} sx={{ primaryTypographyProps: { fontWeight: 600 } }} />
              </ListItem>
            ))}

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
                    sx={{ borderRadius: 2, mb: 0.5, color: '#5D6D7E', pl: 3 }}
                  >
                    <ListItemText primary={cat.label} sx={{ primaryTypographyProps: { fontSize: '0.9rem', fontWeight: 500 } }} />
                  </ListItem>
                ))}
              </>
            )}
            <Divider sx={{ my: 1 }} />

            {isAuthenticated && (
              <ListItem button onClick={handleLogout} sx={{ borderRadius: 2, color: '#E74C3C' }}>
                <ListItemText primary="Log out" sx={{ primaryTypographyProps: { fontWeight: 600 } }} />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </StyledAppBar>
  );
}

export default Navbar;