// src/components/ShopPage.js - FULLY FIXED with storage limit
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Stack,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Pagination,
  Skeleton,
  Avatar,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import StoreIcon from '@mui/icons-material/Store';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import toast from 'react-hot-toast';

// ==========================================
// SHOP SERVICE
// ==========================================
const SHOP_PRODUCTS_KEY = 'creartsi_shop_products';
const PRODUCT_INTERESTS_KEY = 'creartsi_product_interests';

// Get all shop products
const getShopProducts = () => {
  const saved = localStorage.getItem(SHOP_PRODUCTS_KEY);
  return saved ? JSON.parse(saved) : [];
};

// Clean storage jika penuh
const cleanStorage = () => {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('chat_') || key.includes('_notifications_'))) {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (data.length > 50) {
          localStorage.setItem(key, JSON.stringify(data.slice(0, 50)));
        }
      }
    }
  } catch (e) {
    console.log('Storage clean failed');
  }
};

// Save product interest (with storage limit)
const saveProductInterest = (interest) => {
  try {
    const interests = JSON.parse(localStorage.getItem(PRODUCT_INTERESTS_KEY) || '[]');
    const exists = interests.find(i => i.productId === interest.productId && i.buyerId === interest.buyerId);
    if (!exists) {
      const limitedInterests = interests.slice(0, 49);
      limitedInterests.push(interest);
      localStorage.setItem(PRODUCT_INTERESTS_KEY, JSON.stringify(limitedInterests));
    }
    return interest;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      cleanStorage();
      localStorage.setItem(PRODUCT_INTERESTS_KEY, JSON.stringify([interest]));
    }
    return interest;
  }
};

// Categories
const categories = [
  { id: 'all', name: 'All Products', icon: '🛍️' },
  { id: 'Original Designs', name: 'Original Designs', icon: '🎨' },
  { id: '2D Avatars', name: '2D Avatars', icon: '👤' },
  { id: '3D Models', name: '3D Models', icon: '🗿' },
  { id: 'Emotes + Badges', name: 'Emotes + Badges', icon: '😊' },
  { id: 'Stream Assets', name: 'Stream Assets', icon: '📺' },
  { id: 'Graphic Templates', name: 'Graphic Templates', icon: '📐' },
  { id: 'Brushes + Bases', name: 'Brushes + Bases', icon: '🖌️' },
  { id: 'Educational', name: 'Educational', icon: '📚' },
  { id: 'Graphics + Assets', name: 'Graphics + Assets', icon: '🎮' },
  { id: 'Music + Audio', name: 'Music + Audio', icon: '🎵' },
  { id: 'Device Themes', name: 'Device Themes', icon: '📱' },
  { id: 'Indie Games', name: 'Indie Games', icon: '🎮' },
  { id: 'Reading', name: 'Reading', icon: '📖' },
  { id: 'Bots + Software', name: 'Bots + Software', icon: '🤖' },
  { id: 'Misc', name: 'Misc', icon: '✨' }
];

// ==========================================
// PRODUCT CARD COMPONENT
// ==========================================
const ProductCard = ({ product, onContact }) => {
  return (
    <Card sx={{
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 30px rgba(74, 159, 191, 0.15)'
      }
    }}>
      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden', bgcolor: '#F1F5F9' }}>
        <CardMedia
          component="img"
          image={product.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600'}
          alt={product.title}
          sx={{ height: '100%', objectFit: 'cover' }}
        />
        {product.stock > 0 && product.stock < 10 && (
          <Chip
            label={`Only ${product.stock} left`}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: '#EF4444',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.7rem'
            }}
          />
        )}
        <Chip
          label={product.license === 'personal' ? 'Personal' : product.license === 'commercial' ? 'Commercial' : 'Extended'}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            bgcolor: '#1A6B8A',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.7rem'
          }}
        />
      </Box>

      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Typography variant="caption" sx={{ color: '#4A9FBF', fontWeight: 600 }}>
          {product.category}
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5, mb: 1, lineHeight: 1.3 }}>
          {product.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, overflow: 'hidden' }}>
          {product.description}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <Avatar src={product.artistAvatar} sx={{ width: 24, height: 24 }} />
          <Typography variant="caption" fontWeight={600}>{product.artistName}</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Rating value={product.rating || 5} size="small" readOnly />
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            ({product.soldCount || 0} sold)
          </Typography>
        </Stack>

        <Typography variant="h5" fontWeight={800} sx={{ color: '#1A6B8A', mb: 2 }}>
          Rp {product.price?.toLocaleString('id-ID')}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          startIcon={<ChatIcon />}
          onClick={() => onContact(product)}
          sx={{
            bgcolor: '#4A9FBF',
            borderRadius: '30px',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: '#1A6B8A' }
          }}
        >
          Chat to Buy
        </Button>
      </CardContent>
    </Card>
  );
};

// ==========================================
// INTEREST MODAL (FIXED)
// ==========================================
const InterestModal = ({ open, onClose, product, onInterestConfirmed, navigate }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    const currentUserFromStorage = JSON.parse(localStorage.getItem('user'));

    if (!currentUserFromStorage || !currentUserFromStorage.id) {
      toast.error('Please login first to contact artist');
      onClose();
      if (navigate) navigate('/login');
      return;
    }

    if (!product?.artistId) {
      toast.error('Error: Artist ID not found for this product');
      onClose();
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const roomId = `chat_${Math.min(currentUserFromStorage.id, product.artistId)}_${Math.max(currentUserFromStorage.id, product.artistId)}`;

      // Simpan interest (TANPA productImage base64)
      const interest = {
        id: Date.now(),
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        artistId: product.artistId,
        artistName: product.artistName,
        buyerId: currentUserFromStorage.id,
        buyerName: currentUserFromStorage.fullName || currentUserFromStorage.username,
        buyerUsername: currentUserFromStorage.username,
        roomId: roomId,
        status: 'negotiation',
        createdAt: new Date().toISOString()
      };

      saveProductInterest(interest);

      // Auto-create transaction in creartsi_transactions so it shows in purchases
      const trx = {
        id: Date.now(),
        transactionCode: 'TRX-' + Date.now(),
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        artistId: product.artistId,
        artistName: product.artistName,
        buyerId: currentUserFromStorage.id,
        status: 'waiting_payment',
        productFile: product.digitalFile || null,
        createdAt: new Date().toISOString(),
        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      const transactions = JSON.parse(localStorage.getItem('creartsi_transactions') || '[]');
      transactions.unshift(trx);
      localStorage.setItem('creartsi_transactions', JSON.stringify(transactions));

      // Buat chat history jika belum ada
      if (!localStorage.getItem(roomId)) {
        localStorage.setItem(roomId, JSON.stringify([]));
      }

      // Notifikasi ke ARTIST (max 50)
      const artistNotifs = JSON.parse(localStorage.getItem(`artist_notifications_${product.artistId}`) || '[]');
      const limitedArtistNotifs = artistNotifs.slice(0, 49);
      limitedArtistNotifs.unshift({
        id: Date.now(),
        type: 'PRODUCT_INTEREST',
        title: '🛍️ Someone wants to buy your product!',
        message: `${currentUserFromStorage.fullName || currentUserFromStorage.username} is interested in "${product.title}". Price: Rp ${product.price?.toLocaleString('id-ID')}`,
        productId: product.id,
        buyerId: currentUserFromStorage.id,
        buyerName: currentUserFromStorage.fullName || currentUserFromStorage.username,
        roomId: roomId,
        isRead: false,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(`artist_notifications_${product.artistId}`, JSON.stringify(limitedArtistNotifs));

      // Notifikasi ke PEMBELI (PER USER)
      const buyerNotifKey = `user_notifications_${currentUserFromStorage.id}`;
      const buyerNotifs = JSON.parse(localStorage.getItem(buyerNotifKey) || '[]');
      const limitedBuyerNotifs = buyerNotifs.slice(0, 49);
      limitedBuyerNotifs.unshift({
        id: Date.now(),
        message: `You expressed interest in "${product.title}". Chat with ${product.artistName} to negotiate!`,
        type: 'INTEREST_CONFIRMED',
        isRead: false,
        timestamp: new Date().toLocaleTimeString()
      });
      localStorage.setItem(buyerNotifKey, JSON.stringify(limitedBuyerNotifs));

      window.dispatchEvent(new Event('storage'));

      setLoading(false);
      onInterestConfirmed(interest);
      onClose();

      if (navigate) {
        navigate(`/messages?userId=${product.artistId}&productId=${product.id}&productTitle=${encodeURIComponent(product.title)}&productPrice=${product.price}`);
      }
    }, 1000);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#4A9FBF', color: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={800}>Contact Artist</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ mb: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: '16px' }}>
          <Typography variant="subtitle2" color="text.secondary">Product</Typography>
          <Typography variant="body1" fontWeight={700}>{product.title}</Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Artist</Typography>
          <Typography variant="body1">{product.artistName}</Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Price</Typography>
          <Typography variant="h5" fontWeight={800} color="#1A6B8A">
            Rp {product.price?.toLocaleString('id-ID')}
          </Typography>
        </Box>

        <Alert severity="info" sx={{ borderRadius: '12px', mb: 2 }}>
           You will be connected to {product.artistName} via chat. Discuss details, negotiate price, and arrange payment directly.
        </Alert>

        <Alert severity="warning" sx={{ borderRadius: '12px' }}>
          ⚠️ Payment is done outside the platform. CreartsI is not responsible for transactions made outside.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={loading} sx={{ bgcolor: '#4A9FBF' }}>
          {loading ? 'Processing...' : 'Start Chat & Negotiate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ==========================================
// MAIN SHOP PAGE
// ==========================================
function ShopPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [interestSuccess, setInterestSuccess] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [products, selectedCategory, searchTerm, sortBy]);

  const loadProducts = () => {
    setLoading(true);
    const allProducts = getShopProducts();
    setProducts(allProducts);
    setLoading(false);
  };

  const filterAndSort = () => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.artistName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'latest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setPage(1);
  };

  const handleContactArtist = (product) => {
    const userFromStorage = JSON.parse(localStorage.getItem('user'));

    if (!userFromStorage || !userFromStorage.id) {
      toast.error('Please login first to contact artist');
      navigate('/login');
      return;
    }

    if (!product.artistId) {
      toast.error('Error: This product does not have artist information. Please contact support.');
      return;
    }

    setSelectedProduct(product);
    setInterestModalOpen(true);
  };

  const handleInterestConfirmed = (interest) => {
    setInterestSuccess(interest);
    setTimeout(() => setInterestSuccess(null), 5000);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const featuredProducts = [...products].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 6);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 6 }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', pt: 6, pb: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={800} sx={{ color: '#1A6B8A', mb: 1 }}>
            🛍️ Shop Human-Made Digital Products
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 600 }}>
            Chat with artists, negotiate prices, and purchase directly. 100% original artwork from Indonesian creators.
          </Typography>
        </Container>
      </Box>

      {/* Categories Bar */}
      <Box sx={{ bgcolor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', py: 2, overflowX: 'auto' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                label={`${cat.icon} ${cat.name}`}
                onClick={() => setSelectedCategory(cat.id)}
                sx={{
                  bgcolor: selectedCategory === cat.id ? '#4A9FBF' : '#F1F5F9',
                  color: selectedCategory === cat.id ? 'white' : '#475569',
                  fontWeight: 600,
                  borderRadius: '30px',
                  '&:hover': { bgcolor: selectedCategory === cat.id ? '#1A6B8A' : '#E2E8F0' }
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Filter Bar */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: '40px', bgcolor: '#FFFFFF' }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SortIcon sx={{ color: '#94A3B8' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: '40px', bgcolor: '#FFFFFF' }
              }}
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="popular">Most Popular</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'right' }}>
              {filteredProducts.length} products found
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && selectedCategory === 'all' && !searchTerm && (
        <Container maxWidth="lg" sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#1A6B8A', mb: 3 }}>
            Featured Products
          </Typography>
          <Grid container spacing={3}>
            {featuredProducts.slice(0, 4).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} onContact={handleContactArtist} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* All Products Grid */}
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight={800} sx={{ color: '#1A6B8A', mb: 3 }}>
          {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
        </Typography>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rounded" height={380} sx={{ borderRadius: '20px' }} />
              </Grid>
            ))}
          </Grid>
        ) : paginatedProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#FFFFFF', borderRadius: '24px' }}>
            <StoreIcon sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No products found</Typography>
            <Typography variant="body2" color="text.secondary">Try adjusting your search or category</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ProductCard product={product} onContact={handleContactArtist} />
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={5}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: '10px',
                      '&.Mui-selected': { bgcolor: '#4A9FBF', color: 'white' }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Interest Modal */}
      <InterestModal
        open={interestModalOpen}
        onClose={() => setInterestModalOpen(false)}
        product={selectedProduct}
        onInterestConfirmed={handleInterestConfirmed}
        navigate={navigate}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={!!interestSuccess}
        autoHideDuration={5000}
        onClose={() => setInterestSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ borderRadius: '16px' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CheckCircleIcon />
            <span>Request sent! You can now chat with the artist.</span>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/messages')}
              sx={{ borderRadius: '20px' }}
            >
              Go to Chats
            </Button>
          </Stack>
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ShopPage;