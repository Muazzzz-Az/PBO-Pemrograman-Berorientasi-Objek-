// src/components/Navbar.js
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
  Tooltip,
  Fade,
  Paper,
  Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BrushIcon from '@mui/icons-material/Brush';
import { styled, alpha } from '@mui/material/styles';
import { cartService } from '../services/RealTimeDataService';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 1px 0 rgba(74, 159, 191, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(74, 159, 191, 0.1)',
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  color: '#1A6B8A',
  fontWeight: 800,
  fontSize: '1.6rem',
  letterSpacing: '-0.5px',
  fontFamily: '"Plus Jakarta Sans", sans-serif',
  background: 'linear-gradient(135deg, #1A6B8A 0%, #4A9FBF 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const NavButton = styled(Button)(({ theme }) => ({
  borderRadius: '40px',
  padding: '8px 20px',
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: '#5D6D7E',
  position: 'relative',
  transition: 'all 0.2s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: '2px',
    backgroundColor: '#4A9FBF',
    transition: 'width 0.2s ease',
  },
  '&:hover': {
    color: '#4A9FBF',
    backgroundColor: 'rgba(74, 159, 191, 0.05)',
    '&::before': {
      width: '60%',
    },
  },
}));

const ArtistButton = styled(Button)(({ theme }) => ({
  borderRadius: '40px',
  padding: '8px 22px',
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #4A9FBF 0%, #1A6B8A 100%)',
  color: '#FFFFFF',
  border: 'none',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(74, 159, 191, 0.2)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(74, 159, 191, 0.3)',
    background: 'linear-gradient(135deg, #5BAFCF 0%, #2A7B9A 100%)',
  },
}));

const CategoryButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.85rem',
  fontWeight: 500,
  color: '#64748B',
  padding: '6px 14px',
  whiteSpace: 'nowrap',
  borderRadius: '30px',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#4A9FBF',
    backgroundColor: alpha('#4A9FBF', 0.08),
    transform: 'translateY(-1px)',
  },
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  color: '#5D6D7E',
  padding: 8,
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#4A9FBF',
    backgroundColor: alpha('#4A9FBF', 0.08),
    transform: 'scale(1.05)',
  },
}));

const MenuPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  marginTop: '12px',
  minWidth: '220px',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(74, 159, 191, 0.1)',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
}));

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  padding: '12px 20px',
  fontSize: '0.9rem',
  fontWeight: 500,
  gap: '12px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha('#4A9FBF', 0.05),
    paddingLeft: '24px',
  },
}));

// Fungsi helper untuk cek role artist (case insensitive)
const isArtist = (user) => {
  if (!user) return false;
  const role = user.role?.toLowerCase();
  return role === 'artist';
};

const isVerifiedArtist = (user) => {
  return isArtist(user) && user?.isVerified === true;
};

function Navbar({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [openReLogin, setOpenReLogin] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const location = useLocation();
  const [showCategories, setShowCategories] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Load notifications from localStorage PER USER
  useEffect(() => {
    const loadNotifications = () => {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const NOTIF_KEY = `user_notifications_${currentUser.id}`;
      const savedNotifications = JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]');
      setNotifications(savedNotifications);
      const unread = savedNotifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    };

    loadNotifications();

    const handleStorageChange = (e) => {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser && e.key === `user_notifications_${currentUser.id}`) {
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
        const currentUser = JSON.parse(localStorage.getItem('user'));

        if (currentUser && currentUser.role?.toLowerCase() === 'admin') {
          return;
        }

        if (currentUser) {
          const NOTIF_KEY = `user_notifications_${currentUser.id}`;
          const existingNotifs = JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]');
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

            localStorage.setItem(NOTIF_KEY, JSON.stringify(updatedNotifs));
            setNotifications(updatedNotifs);
            setUnreadCount(prev => prev + 1);
          }
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

  const handleLogout = (redirectTo = '/') => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('artist_notification');
    localStorage.removeItem('showNavbarCategories');
    setIsAuthenticated(false);
    setUser(null);
    setAnchorEl(null);
    setAnchorElNotif(null);
    setMobileOpen(false);
    setOpenReLogin(false);
    
    const targetPath = typeof redirectTo === 'string' ? redirectTo : '/';
    navigate(targetPath);
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNotifOpen = (event) => setAnchorElNotif(event.currentTarget);
  const handleNotifClose = () => setAnchorElNotif(null);

  const handleMarkAsRead = (notifId) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) return;

    const NOTIF_KEY = `user_notifications_${currentUser.id}`;
    const updatedNotifs = notifications.map(notif =>
      notif.id === notifId ? { ...notif, isRead: true } : notif
    );
    localStorage.setItem(NOTIF_KEY, JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs);
    const unread = updatedNotifs.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  };

  const handleMarkAllAsRead = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) return;

    const NOTIF_KEY = `user_notifications_${currentUser.id}`;
    const updatedNotifs = notifications.map(notif => ({ ...notif, isRead: true }));
    localStorage.setItem(NOTIF_KEY, JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs);
    setUnreadCount(0);
  };

  const handleClearNotification = (notifId) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) return;

    const NOTIF_KEY = `user_notifications_${currentUser.id}`;
    const updatedNotifs = notifications.filter(n => n.id !== notifId);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs);
    const unread = updatedNotifs.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  };

  const menuItems = [
    { label: 'Commission', path: '/artists', icon: <BrushIcon sx={{ fontSize: 18 }} /> },
    { label: 'Shop', path: '/shop', icon: <ShoppingCartIcon sx={{ fontSize: 18 }} /> }
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
    <StyledAppBar position="sticky" color="transparent" elevation={0} sx={{ boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : '0 1px 0 rgba(74, 159, 191, 0.08)' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1, px: { xs: 1, md: 2 } }}>

          {/* Left Side: Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <LogoContainer onClick={handleGoHome}>
              <LogoText variant="h6">
                Crearts<span style={{ color: '#4A9FBF', WebkitTextFillColor: '#4A9FBF' }}>I</span>
              </LogoText>
            </LogoContainer>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {menuItems.map((item) => (
                  <NavButton
                    key={item.label}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    onClick={() => {
                      localStorage.removeItem('showNavbarCategories');
                      setShowCategories(false);
                    }}
                  >
                    {item.label}
                  </NavButton>
                ))}
              </Box>
            )}
          </Box>

          {/* Right Side: Actions */}
          {!isMobile ? (
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>

              {/* Bell Icon */}
              {isAuthenticated && (
                <Tooltip title="Notifications" arrow placement="bottom">
                  <IconButtonStyled onClick={handleNotifOpen}>
                    <Badge
                      badgeContent={unreadCount}
                      color="error"
                      overlap="circular"
                      sx={{
                        '& .MuiBadge-badge': {
                          animation: unreadCount > 0 ? 'pulse 1.5s infinite' : 'none',
                        },
                      }}
                    >
                      <NotificationsNoneIcon sx={{ width: 22, height: 22 }} />
                    </Badge>
                  </IconButtonStyled>
                </Tooltip>
              )}

              {/* Notifications Menu */}
              <Menu
                anchorEl={anchorElNotif}
                open={Boolean(anchorElNotif)}
                onClose={handleNotifClose}
                TransitionComponent={Fade}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{ component: MenuPaper }}
              >
                <Box px={2.5} py={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom="1px solid rgba(74, 159, 191, 0.1)">
                  <Typography variant="subtitle1" fontWeight={800} color="#1A6B8A" letterSpacing="-0.3px">
                    Notifications
                  </Typography>
                  {notifications.length > 0 && unreadCount > 0 && (
                    <Button size="small" onClick={handleMarkAllAsRead} sx={{ textTransform: 'none', fontSize: '0.7rem', color: '#4A9FBF', fontWeight: 600 }}>
                      Mark all read
                    </Button>
                  )}
                </Box>

                {notifications.length === 0 ? (
                  <Box p={4} textAlign="center">
                    <Typography variant="body2" color="textSecondary">No notifications yet</Typography>
                    <Typography variant="caption" color="textSecondary">We'll notify you when something arrives</Typography>
                  </Box>
                ) : (
                  <Box sx={{ maxHeight: 380, overflowY: 'auto' }}>
                    {notifications.map((notif, index) => (
                      <MenuItemStyled
                        key={notif.id}
                        onClick={() => {
                          handleMarkAsRead(notif.id);
                          if (notif.type === 'ARTIST_APPROVAL') {
                            setOpenReLogin(true);
                          }
                        }}
                        sx={{
                          backgroundColor: notif.isRead ? 'transparent' : alpha('#4A9FBF', 0.04),
                          borderBottom: index !== notifications.length - 1 ? '1px solid rgba(74, 159, 191, 0.05)' : 'none',
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: notif.isRead ? 500 : 700, color: '#2C3E50', mb: 0.5 }}>
                            {notif.type === 'ARTIST_APPROVAL' ? '🎉 Artist Verification' : '📢 Notification'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748B', pr: 2, lineHeight: 1.4 }}>
                            {notif.message}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.5 }}>
                            {notif.timestamp}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleClearNotification(notif.id); }}
                          sx={{ color: '#94A3B8', '&:hover': { color: '#EF4444' } }}
                        >
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </MenuItemStyled>
                    ))}
                  </Box>
                )}
              </Menu>

              {/* Artist Button */}
              <ArtistButton component={Link} to="/for-artists">
                ✨ I'm an artist+
              </ArtistButton>

              {/* Profile Dropdown */}
              <Box>
                <Tooltip title={isAuthenticated ? "Account" : "Login"} arrow placement="bottom">
                  <IconButtonStyled onClick={handleMenuOpen}>
                    {!isAuthenticated ? (
                      <AccountCircleIcon sx={{ width: 32, height: 32 }} />
                    ) : (
                      <Avatar
                        sx={{
                          bgcolor: 'transparent',
                          background: 'linear-gradient(135deg, #4A9FBF 0%, #1A6B8A 100%)',
                          width: 36,
                          height: 36,
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 8px rgba(74, 159, 191, 0.2)',
                        }}
                      >
                        {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
                      </Avatar>
                    )}
                  </IconButtonStyled>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  TransitionComponent={Fade}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{ component: MenuPaper }}
                >
                  {isAuthenticated ? (
                    <Box>
                      <MenuItemStyled component={Link} to="/profile" onClick={handleMenuClose}>
                        <PersonIcon sx={{ fontSize: 20, color: '#4A9FBF' }} />
                        Profile
                      </MenuItemStyled>
                      <MenuItemStyled component={Link} to="/messages" onClick={handleMenuClose}>
                        <ChatIcon sx={{ fontSize: 20, color: '#4A9FBF' }} />
                        Messages
                      </MenuItemStyled>
                      <MenuItemStyled component={Link} to="/cart" onClick={handleMenuClose}>
                        <ShoppingCartIcon sx={{ fontSize: 20, color: '#4A9FBF' }} />
                        Cart {cartCount > 0 && `(${cartCount})`}
                      </MenuItemStyled>

                      <MenuItemStyled component={Link} to="/my-purchases" onClick={handleMenuClose}>
                        My Purchases
                      </MenuItemStyled>

                      {/* 🔥 MY COMMISSIONS - untuk artist (case insensitive) */}
                      {isArtist(user) && (
                        <MenuItemStyled component={Link} to="/my-commissions" onClick={handleMenuClose}>
                          <BrushIcon sx={{ fontSize: 20, color: '#4A9FBF' }} />
                          My Commissions
                        </MenuItemStyled>
                      )}

                      {/* 🔥 CREATOR DASHBOARD - untuk artist yang sudah terverifikasi */}
                      {isVerifiedArtist(user) && (
                        <MenuItemStyled component={Link} to="/profile?tab=creator" onClick={handleMenuClose}>
                          <DashboardIcon sx={{ fontSize: 20, color: '#4A9FBF' }} />
                          Creator Dashboard
                        </MenuItemStyled>
                      )}

                      <Divider sx={{ my: 1, borderColor: 'rgba(74, 159, 191, 0.1)' }} />
                      <MenuItemStyled onClick={handleLogout} sx={{ color: '#E74C3C' }}>
                        <LogoutIcon sx={{ fontSize: 20 }} />
                        Log out
                      </MenuItemStyled>
                    </Box>
                  ) : (
                    <Box>
                      <MenuItemStyled onClick={() => { navigate('/login'); handleMenuClose(); }} sx={{ color: '#1A6B8A', fontWeight: 700 }}>
                        <PersonIcon sx={{ fontSize: 20 }} />
                        Login
                      </MenuItemStyled>
                      <MenuItemStyled onClick={() => { navigate('/register'); handleMenuClose(); }}>
                        Sign Up
                      </MenuItemStyled>
                    </Box>
                  )}
                </Menu>
              </Box>
            </Box>
          ) : (
            /* Mobile Menu */
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAuthenticated && (
                <IconButtonStyled onClick={handleNotifOpen}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsNoneIcon />
                  </Badge>
                </IconButtonStyled>
              )}
              <IconButtonStyled onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButtonStyled>
            </Box>
          )}
        </Toolbar>

        {/* Category Sub-navbar */}
        {!isMobile && showCategories && (
          <Box sx={{
            display: 'flex',
            gap: 0.5,
            py: 1,
            px: 1,
            borderTop: '1px solid rgba(74, 159, 191, 0.06)',
            overflowX: 'auto',
            justifyContent: 'flex-start',
            '&::-webkit-scrollbar': { height: '4px' },
            '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#CBD5E1', borderRadius: '10px' },
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
        <Box sx={{ width: 300, p: 2.5, bgcolor: '#FFFFFF', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <LogoText variant="h6" sx={{ fontSize: '1.3rem' }}>
              Crearts<span style={{ color: '#4A9FBF' }}>I</span>
            </LogoText>
            <IconButtonStyled onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButtonStyled>
          </Box>

          <List sx={{ py: 0 }}>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.label}
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 3,
                  mb: 1,
                  color: '#5D6D7E',
                  py: 1.5,
                  '&:hover': { backgroundColor: alpha('#4A9FBF', 0.08), color: '#4A9FBF' }
                }}
              >
                <ListItemText primary={item.label} sx={{ primaryTypographyProps: { fontWeight: 600, fontSize: '1rem' } }} />
              </ListItem>
            ))}

            {showCategories && (
              <>
                <Divider sx={{ my: 2, borderColor: 'rgba(74, 159, 191, 0.1)' }} />
                <Box px={1} py={0.5} mb={1}>
                  <Typography variant="caption" fontWeight={700} color="#4A9FBF" letterSpacing="0.5px">
                    CATEGORIES
                  </Typography>
                </Box>
                {categories.map((cat) => (
                  <ListItem
                    button
                    key={cat.label}
                    component={Link}
                    to={cat.path}
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      color: '#5D6D7E',
                      pl: 3,
                      py: 1,
                      '&:hover': { backgroundColor: alpha('#4A9FBF', 0.05), color: '#4A9FBF' }
                    }}
                  >
                    <ListItemText primary={cat.label} sx={{ primaryTypographyProps: { fontSize: '0.9rem', fontWeight: 500 } }} />
                  </ListItem>
                ))}
              </>
            )}

            <Divider sx={{ my: 2, borderColor: 'rgba(74, 159, 191, 0.1)' }} />

            {isAuthenticated && (
              <ListItem
                button
                onClick={handleLogout}
                sx={{
                  borderRadius: 3,
                  color: '#E74C3C',
                  py: 1.5,
                  mt: 1,
                  '&:hover': { backgroundColor: alpha('#E74C3C', 0.08) }
                }}
              >
                <ListItemText primary="Log out" sx={{ primaryTypographyProps: { fontWeight: 700 } }} />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      {/* POPUP LOGIN ULANG */}
      <Dialog open={openReLogin} onClose={() => setOpenReLogin(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#1A6B8A', textAlign: 'center' }}>
          Congratulations on becoming an artist! 🎨
        </DialogTitle>
        <DialogContent>
          <Typography textAlign="center" color="textSecondary">
            Your account has been verified. Please login again to activate your Artist features!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="contained" onClick={() => handleLogout('/login')} sx={{ borderRadius: '30px', px: 4, bgcolor: '#4A9FBF' }}>
            Re-Login Now
          </Button>
        </DialogActions>
      </Dialog>
    </StyledAppBar>
  );
}

export default Navbar;