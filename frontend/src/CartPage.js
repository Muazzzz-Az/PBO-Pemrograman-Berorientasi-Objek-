// src/components/CartPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Box, Container, Typography, Card, CardContent, Grid,
  Button, IconButton, Stack, Divider, Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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
  }, [currentUser]);

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

  const handleCheckout = () => {
    toast('Checkout feature coming soon!', { icon: 'ℹ️' });
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingCartIcon sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
        <Typography variant="h5" sx={{ color: '#1A6B8A', mb: 1 }}>Your cart is empty</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Add some commissions to get started</Typography>
        <Button variant="contained" onClick={() => navigate('/artists')} sx={{ bgcolor: '#4A9FBF' }}>Browse Commissions</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A6B8A', mb: 4 }}>🛍️ My Cart ({cartItems.length})</Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card key={item.id} sx={{ mb: 2, borderRadius: '16px' }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} sm={2}>
                      <img src={item.coverImage} alt={item.title} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    </Grid>
                    <Grid item xs={6} sm={5}>
                      <Typography variant="subtitle1" fontWeight={700}>{item.title}</Typography>
                      <Typography variant="caption" color="#4A9FBF">{item.artistName}</Typography>
                    </Grid>
                    <Grid item xs={3} sm={2}>
                      <Typography variant="h6" fontWeight={800} color="#1A6B8A">Rp {item.price.toLocaleString('id-ID')}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton size="small" onClick={() => handleUpdateQuantity(item, -1)}><RemoveIcon fontSize="small" /></IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => handleUpdateQuantity(item, 1)}><AddIcon fontSize="small" /></IconButton>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={1}>
                      <IconButton onClick={() => handleRemoveItem(item.id)} color="error"><DeleteIcon /></IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: '16px', position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Order Summary</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography>Subtotal ({cartItems.length} items)</Typography>
                  <Typography fontWeight={600}>Rp {total.toLocaleString('id-ID')}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography>Platform Fee</Typography>
                  <Typography fontWeight={600}>Rp {(total * 0.05).toLocaleString('id-ID')}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={800}>Total</Typography>
                  <Typography variant="h5" fontWeight={800} color="#1A6B8A">Rp {(total * 1.05).toLocaleString('id-ID')}</Typography>
                </Box>
                <Button fullWidth variant="contained" onClick={handleCheckout} sx={{ bgcolor: '#4A9FBF', py: 1.5, borderRadius: '40px' }}>Proceed to Checkout</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CartPage;