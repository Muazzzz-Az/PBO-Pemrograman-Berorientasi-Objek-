// src/components/ShopPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PaymentIcon from '@mui/icons-material/Payment';

// ==========================================
// SHOP SERVICE
// ==========================================
const SHOP_PRODUCTS_KEY = 'creartsi_shop_products';
const SHOP_PURCHASES_KEY = 'creartsi_shop_purchases';

// Get all shop products
const getShopProducts = () => {
  const saved = localStorage.getItem(SHOP_PRODUCTS_KEY);
  return saved ? JSON.parse(saved) : [];
};

// Get products by category
const getProductsByCategory = (category) => {
  const products = getShopProducts();
  if (!category) return products;
  return products.filter(p => p.category === category);
};

// Save purchase
const savePurchase = (purchase) => {
  const purchases = JSON.parse(localStorage.getItem(SHOP_PURCHASES_KEY) || '[]');
  purchases.push(purchase);
  localStorage.setItem(SHOP_PURCHASES_KEY, JSON.stringify(purchases));
  return purchase;
};

// Get user purchases
const getUserPurchases = (userId) => {
  const purchases = JSON.parse(localStorage.getItem(SHOP_PURCHASES_KEY) || '[]');
  return purchases.filter(p => p.buyerId === userId);
};

// Get product by ID
const getProductById = (id) => {
  const products = getShopProducts();
  return products.find(p => p.id === parseInt(id));
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
const ProductCard = ({ product, onBuy }) => {
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
          startIcon={<ShoppingCartIcon />}
          onClick={() => onBuy(product)}
          sx={{
            bgcolor: '#4A9FBF',
            borderRadius: '30px',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: '#1A6B8A' }
          }}
        >
          Buy Now
        </Button>
      </CardContent>
    </Card>
  );
};

// ==========================================
// CHECKOUT MODAL
// ==========================================
const CheckoutModal = ({ open, onClose, product, onPurchaseComplete }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handlePurchase = () => {
    if (!currentUser) {
      alert('Please login first to purchase');
      onClose();
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Create purchase record
      const purchase = {
        id: Date.now(),
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        productFile: product.digitalFile,
        artistId: product.artistId,
        artistName: product.artistName,
        buyerId: currentUser.id,
        buyerName: currentUser.fullName,
        buyerEmail: currentUser.email,
        paymentMethod: paymentMethod,
        status: 'completed',
        purchaseDate: new Date().toISOString(),
        downloadUrl: product.digitalFile?.base64 || null,
        downloadCount: 0
      };

      savePurchase(purchase);

      // Update product sold count
      const allProducts = getShopProducts();
      const updatedProducts = allProducts.map(p => {
        if (p.id === product.id) {
          return { ...p, soldCount: (p.soldCount || 0) + 1, stock: Math.max(0, (p.stock || 0) - 1) };
        }
        return p;
      });
      localStorage.setItem(SHOP_PRODUCTS_KEY, JSON.stringify(updatedProducts));

      // Add notification
      const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
      notifications.unshift({
        id: Date.now(),
        message: `✅ Purchase successful! You bought "${product.title}". Download your file now!`,
        type: 'PURCHASE_SUCCESS',
        isRead: false,
        timestamp: new Date().toLocaleTimeString()
      });
      localStorage.setItem('user_notifications', JSON.stringify(notifications));

      // Notify artist
      const artistNotifs = JSON.parse(localStorage.getItem(`artist_notifications_${product.artistId}`) || '[]');
      artistNotifs.unshift({
        id: Date.now(),
        type: 'NEW_PURCHASE',
        title: 'New Purchase! 🛍️',
        message: `${currentUser.fullName} purchased "${product.title}" for Rp ${product.price.toLocaleString('id-ID')}`,
        isRead: false,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(`artist_notifications_${product.artistId}`, JSON.stringify(artistNotifs));

      window.dispatchEvent(new Event('storage'));

      setLoading(false);
      onPurchaseComplete(purchase);
      onClose();

      // Show download dialog
      setTimeout(() => {
        if (product.digitalFile?.base64) {
          const link = document.createElement('a');
          link.href = product.digitalFile.base64;
          link.download = product.digitalFile.name || 'download.zip';
          link.click();
        }
      }, 500);
    }, 1500);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#4A9FBF', color: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={800}>Checkout</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ mb: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: '16px' }}>
          <Typography variant="subtitle2" color="text.secondary">Product</Typography>
          <Typography variant="body1" fontWeight={700}>{product.title}</Typography>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Seller</Typography>
          <Typography variant="body1">{product.artistName}</Typography>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Price</Typography>
          <Typography variant="h5" fontWeight={800} color="#1A6B8A">
            Rp {product.price?.toLocaleString('id-ID')}
          </Typography>
        </Box>

        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Payment Method</Typography>
        <TextField
          select
          fullWidth
          size="small"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          sx={{ mb: 3 }}
        >
          <MenuItem value="bank_transfer">🏦 Bank Transfer (BNI/BCA/Mandiri)</MenuItem>
          <MenuItem value="credit_card">💳 Credit Card</MenuItem>
          <MenuItem value="ewallet">📱 E-Wallet (OVO/GoPay/Dana)</MenuItem>
        </TextField>

        <Alert severity="info" sx={{ borderRadius: '12px' }}>
          After purchase, you will get instant download link for your digital product.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button
          onClick={handlePurchase}
          variant="contained"
          disabled={loading}
          sx={{ bgcolor: '#4A9FBF' }}
        >
          {loading ? 'Processing...' : `Pay Rp ${product.price?.toLocaleString('id-ID')}`}
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
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const currentUser = JSON.parse(localStorage.getItem('user'));

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

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.artistName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
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

  const handleBuy = (product) => {
    if (!currentUser) {
      alert('Please login first to purchase');
      navigate('/login');
      return;
    }
    setSelectedProduct(product);
    setCheckoutOpen(true);
  };

  const handlePurchaseComplete = (purchase) => {
    setPurchaseSuccess(purchase);
    loadProducts();
    setTimeout(() => setPurchaseSuccess(null), 5000);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Featured products (top selling)
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
            Support independent creators. Download instantly after purchase. 100% original artwork.
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
            ⭐ Featured Products
          </Typography>
          <Grid container spacing={3}>
            {featuredProducts.slice(0, 4).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} onBuy={handleBuy} />
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
                  <ProductCard product={product} onBuy={handleBuy} />
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

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        product={selectedProduct}
        onPurchaseComplete={handlePurchaseComplete}
      />

      {/* Purchase Success Snackbar */}
      <Snackbar
        open={!!purchaseSuccess}
        autoHideDuration={5000}
        onClose={() => setPurchaseSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ borderRadius: '16px' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <span>✅ Purchase successful! Your download has started.</span>
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate('/my-purchases')}
            >
              My Purchases
            </Button>
          </Stack>
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ShopPage;