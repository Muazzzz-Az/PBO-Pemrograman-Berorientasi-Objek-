// src/components/CartPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Typography, Card, CardContent, Grid,
  Button, IconButton, Stack, Divider, Paper, Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { cartService } from '../services/RealTimeDataService';

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [currentUser, navigate]);

  const loadCart = () => {
    const cart = cartService.getCart();
    const userCart = cart.filter(item => item.userId === currentUser.id);
    setCartItems(userCart);
  };

  const handleUpdateQuantity = (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1) {
      cartService.updateQuantity(item.id, currentUser.id, newQuantity);
      loadCart();
    }
  };

  const handleRemoveItem = (itemId) => {
    cartService.removeFromCart(itemId, currentUser.id);
    loadCart();
  };

  // Fungsi Request Commission - langsung ke artist profile
  const handleRequest = (item) => {
    navigate(`/artist/${item.artistName || item.artistId}`);
  };

  // Fungsi Chat dengan artist
  const handleChat = (item) => {
    navigate(`/messages?userId=${item.artistId}&productId=${item.commissionId}&productTitle=${encodeURIComponent(item.title)}`);
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Paper sx={{ p: 6, borderRadius: '24px' }}>
          <ShoppingCartIcon sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#1A6B8A', mb: 1 }}>Your cart is empty</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add some commissions you like to your wishlist!
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/artists"
            sx={{ bgcolor: '#4A9FBF', borderRadius: '40px', textTransform: 'none' }}
          >
            Browse Commissions
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A6B8A', mb: 4 }}>
          My Chart Wishlist ({cartItems.length})
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card key={item.id} sx={{ mb: 2, borderRadius: '16px' }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} sm={2}>
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="subtitle1" fontWeight={700}>{item.title}</Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 20, height: 20, bgcolor: '#4A9FBF', fontSize: '0.7rem' }}>
                          {item.artistName?.charAt(0)}
                        </Avatar>
                        <Typography variant="caption" sx={{ color: '#4A9FBF' }}>{item.artistName}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={3} sm={2}>
                      <Typography variant="h6" fontWeight={800} sx={{ color: '#1A6B8A' }}>
                        Rp {item.price?.toLocaleString('id-ID')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton size="small" onClick={() => handleUpdateQuantity(item, -1)}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => handleUpdateQuantity(item, 1)}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <IconButton onClick={() => handleRemoveItem(item.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>

                  {/* Tombol Aksi: Request dan Chat */}
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingBagIcon />}
                      onClick={() => handleRequest(item)}
                      sx={{
                        bgcolor: '#4A9FBF',
                        borderRadius: '30px',
                        textTransform: 'none',
                        flex: 1,
                        '&:hover': { bgcolor: '#1A6B8A' }
                      }}
                    >
                      Request Commission
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ChatIcon />}
                      onClick={() => handleChat(item)}
                      sx={{
                        borderRadius: '30px',
                        textTransform: 'none',
                        borderColor: '#4A9FBF',
                        color: '#4A9FBF',
                        flex: 1,
                        '&:hover': { bgcolor: 'rgba(74, 159, 191, 0.05)' }
                      }}
                    >
                      Chat with Artist
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Sidebar Summary - Hanya info, bukan checkout */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: '16px', position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: '#1A6B8A' }}>
                  Wishlist Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography>Items in wishlist</Typography>
                  <Typography fontWeight={600}>{cartItems.length} item(s)</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography>Total value</Typography>
                  <Typography fontWeight={800} color="#1A6B8A">
                    Rp {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('id-ID')}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                  This is your chart wishlist.
                  <br />
                  Click "Request Commission" to discuss with artist,
                  <br />
                  or "Chat with Artist" to negotiate prices.
                </Typography>

                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  to="/artists"
                  sx={{ mt: 3, borderRadius: '30px', textTransform: 'none', borderColor: '#4A9FBF', color: '#4A9FBF' }}
                >
                  Browse More Commissions
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CartPage;