// src/components/artist/ShopManager.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Sell as SellIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import BaseCard from './BaseCard';

// Key untuk localStorage produk shop
const SHOP_PRODUCTS_KEY = 'creartsi_shop_products';

const ShopManager = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isDigital: true,
    stock: 1
  });

  // Load products dari localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem(SHOP_PRODUCTS_KEY);
    if (savedProducts) {
      const allProducts = JSON.parse(savedProducts);
      // Filter hanya milik user ini
      setProducts(allProducts.filter(p => p.artistId === user?.id));
    }
  }, [user?.id]);

  const saveToLocalStorage = (updatedProducts) => {
    const allProducts = JSON.parse(localStorage.getItem(SHOP_PRODUCTS_KEY) || '[]');
    // Hapus produk lama milik user ini
    const filtered = allProducts.filter(p => p.artistId !== user?.id);
    const merged = [...filtered, ...updatedProducts];
    localStorage.setItem(SHOP_PRODUCTS_KEY, JSON.stringify(merged));
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
        isDigital: product.isDigital,
        stock: product.stock
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        isDigital: true,
        stock: 1
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProduct = () => {
    if (!formData.title || !formData.price) {
      alert('Judul dan harga wajib diisi!');
      return;
    }

    let newProducts;
    if (editingProduct) {
      // Update existing
      const updatedProduct = {
        ...editingProduct,
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };
      newProducts = products.map(p => p.id === editingProduct.id ? updatedProduct : p);
    } else {
      // Create new
      const newProduct = {
        id: Date.now(),
        artistId: user?.id,
        artistName: user?.fullName || user?.username,
        createdAt: new Date().toISOString(),
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        soldCount: 0
      };
      newProducts = [...products, newProduct];
    }

    setProducts(newProducts);
    saveToLocalStorage(newProducts);
    handleCloseDialog();
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      const newProducts = products.filter(p => p.id !== productId);
      setProducts(newProducts);
      saveToLocalStorage(newProducts);
    }
  };

  const categories = [
    'Digital Art',
    'Physical Print',
    'Merchandise',
    'Custom Commission',
    'Assets & Resources',
    'Other'
  ];

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1A6B8A">
            🛍️ Toko Karya
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Jual karya seni digital atau fisik. Produkmu akan muncul di halaman Shop untuk dibeli pengguna lain.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#4A9FBF', borderRadius: '20px', textTransform: 'none' }}
        >
          Tambah Produk
        </Button>
      </Box>

      {/* List Products */}
      {products.length === 0 ? (
        <BaseCard sx={{ textAlign: 'center', py: 8 }}>
          <SellIcon sx={{ fontSize: 60, color: '#CBD5E1', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Belum Ada Produk
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Mulai jual karya senimu dengan menambahkan produk pertama.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => handleOpenDialog()}
            sx={{ borderColor: '#4A9FBF', color: '#4A9FBF' }}
          >
            + Tambah Produk
          </Button>
        </BaseCard>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ borderRadius: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative', pt: '75%', overflow: 'hidden', bgcolor: '#F2F7F9' }}>
                  <CardMedia
                    component="img"
                    image={product.imageUrl || 'https://placehold.co/400x300/4A9FBF/white?text=No+Image'}
                    alt={product.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <Chip
                    label={product.isDigital ? '🖥️ Digital' : '📦 Fisik'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      fontWeight: 600
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" color="#4A9FBF" gutterBottom>
                    {product.category}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1, fontSize: '1rem' }}>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={800} color="#1A6B8A">
                      Rp {product.price.toLocaleString('id-ID')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Stok: {product.stock}
                    </Typography>
                  </Box>
                </CardContent>
                <Box display="flex" borderTop="1px solid rgba(74, 159, 191, 0.1)">
                  <IconButton
                    onClick={() => handleOpenDialog(product)}
                    sx={{ flex: 1, borderRadius: 0, py: 1, color: '#4A9FBF' }}
                  >
                    <EditIcon fontSize="small" /> Edit
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteProduct(product.id)}
                    sx={{ flex: 1, borderRadius: 0, py: 1, color: '#EF4444' }}
                  >
                    <DeleteIcon fontSize="small" /> Hapus
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog Add/Edit Product */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700} color="#1A6B8A">
            {editingProduct ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Judul Produk"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              select
              label="Kategori"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              SelectProps={{ native: true }}
            >
              <option value="">Pilih Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Deskripsi"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Harga (Rp)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
              }}
            />
            <TextField
              fullWidth
              label="URL Gambar"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://..."
            />
            <TextField
              fullWidth
              label="Stok"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isDigital}
                  onChange={(e) => setFormData({ ...formData, isDigital: e.target.checked })}
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#4A9FBF' } }}
                />
              }
              label={formData.isDigital ? "🖥️ Produk Digital (download otomatis)" : "📦 Produk Fisik (butuh pengiriman)"}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="error" variant="outlined">
            Batal
          </Button>
          <Button onClick={handleSaveProduct} variant="contained" sx={{ bgcolor: '#4A9FBF' }}>
            Simpan Produk
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShopManager;