// src/components/artist/ShopManager.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  LinearProgress,
  ImageList,
  ImageListItem,
  Alert,
  Rating,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  CloudUpload as UploadIcon,
  ShoppingBag as ShopIcon,
  AttachFile as FileIcon
} from '@mui/icons-material';
import BaseCard from './BaseCard';

const SHOP_PRODUCTS_KEY = 'creartsi_shop_products';

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
};

const ImageUploadField = ({ label, value, onChange, multiple = false }) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLoading(true);
    try {
      if (multiple) {
        const newImages = [...(value || [])];
        for (const file of files) {
          const base64 = await fileToBase64(file);
          newImages.push(base64);
        }
        onChange(newImages);
      } else {
        const base64 = await fileToBase64(files[0]);
        onChange(base64);
      }
    } catch (error) {
      alert('Failed to upload image');
    }
    setLoading(false);
  };

  const handleRemove = (index) => {
    if (multiple) {
      const newImages = [...value];
      newImages.splice(index, 1);
      onChange(newImages);
    } else {
      onChange('');
    }
  };

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} color="#1A6B8A" mb={1}>{label}</Typography>
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{
          border: '2px dashed #CBD5E1',
          borderRadius: '12px',
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: '#F8FAFC',
          transition: 'all 0.2s',
          opacity: loading ? 0.5 : 1,
          '&:hover': { borderColor: '#4A9FBF', bgcolor: '#F0F9FF' }
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple={multiple} style={{ display: 'none' }} onChange={handleFileUpload} />
        <UploadIcon sx={{ fontSize: 40, color: '#94A3B8', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Uploading...' : 'Click to upload or drag and drop'}
        </Typography>
        <Typography variant="caption" color="text.secondary">JPG, PNG, GIF, WebP up to 10MB</Typography>
      </Box>

      {value && (
        <Box mt={2}>
          {multiple ? (
            <ImageList cols={4} rowHeight={100} sx={{ mb: 0 }}>
              {value.map((img, idx) => (
                <ImageListItem key={idx} sx={{ position: 'relative' }}>
                  <img src={img} alt={`preview-${idx}`} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }} />
                  <IconButton size="small" onClick={() => handleRemove(idx)} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <img src={value} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
              <IconButton size="small" onClick={() => handleRemove()} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white' }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

const FileUploadField = ({ label, value, onChange }) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      onChange({ base64, name: file.name, size: file.size });
    } catch (error) {
      alert('Failed to upload file');
    }
    setLoading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} color="#1A6B8A" mb={1}>{label}</Typography>
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{
          border: '2px dashed #CBD5E1',
          borderRadius: '12px',
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: '#F8FAFC',
          opacity: loading ? 0.5 : 1,
          '&:hover': { borderColor: '#4A9FBF', bgcolor: '#F0F9FF' }
        }}
      >
        <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
        <FileIcon sx={{ fontSize: 40, color: '#94A3B8', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Uploading...' : 'Click to upload file (ZIP, PNG, JPG, PDF, MP4)'}
        </Typography>
        <Typography variant="caption" color="text.secondary">Max file size: 500MB</Typography>
      </Box>
      {value && (
        <Box mt={2} display="flex" alignItems="center" gap={1} p={1.5} bgcolor="#F0F9FF" borderRadius={2}>
          <FileIcon sx={{ color: '#4A9FBF' }} />
          <Box flex={1}>
            <Typography variant="body2" fontWeight={600}>{value.name}</Typography>
            <Typography variant="caption" color="text.secondary">{formatFileSize(value.size)}</Typography>
          </Box>
          <IconButton size="small" onClick={() => onChange(null)} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

const ShopManager = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    coverImage: '',
    sampleImages: [],
    digitalFile: null,
    stock: 0,
    license: 'personal',
    tags: []
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const savedProducts = localStorage.getItem(SHOP_PRODUCTS_KEY);
    if (savedProducts) {
      const allProducts = JSON.parse(savedProducts);
      setProducts(allProducts.filter(p => p.artistId === user?.id));
    }
  }, [user?.id]);

  const saveToLocalStorage = (updatedProducts) => {
    const allProducts = JSON.parse(localStorage.getItem(SHOP_PRODUCTS_KEY) || '[]');
    const filtered = allProducts.filter(p => p.artistId !== user?.id);
    const merged = [...filtered, ...updatedProducts];
    localStorage.setItem(SHOP_PRODUCTS_KEY, JSON.stringify(merged));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        coverImage: product.coverImage || '',
        sampleImages: product.sampleImages || [],
        digitalFile: product.digitalFile || null,
        stock: product.stock || 0,
        license: product.license || 'personal',
        tags: product.tags || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        coverImage: '',
        sampleImages: [],
        digitalFile: null,
        stock: 0,
        license: 'personal',
        tags: []
      });
    }
    setOpenDialog(true);
  };

  const handleSaveProduct = () => {
    if (!formData.title || !formData.price || !formData.category) {
      alert('Please fill all required fields');
      return;
    }
    if (!formData.digitalFile) {
      alert('Please upload the digital file');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let newProducts;
      if (editingProduct) {
        newProducts = products.map(p => p.id === editingProduct.id
          ? { ...editingProduct, ...formData, updatedAt: new Date().toISOString() }
          : p);
      } else {
        const newProduct = {
          id: Date.now(),
          artistId: user?.id,
          artistName: user?.fullName || user?.username,
          createdAt: new Date().toISOString(),
          ...formData,
          price: parseFloat(formData.price),
          soldCount: 0,
          rating: 0,
          totalReviews: 0
        };
        newProducts = [...products, newProduct];
      }
      setProducts(newProducts);
      saveToLocalStorage(newProducts);
      setLoading(false);
      setOpenDialog(false);
    }, 500);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Delete this product?')) {
      const newProducts = products.filter(p => p.id !== id);
      setProducts(newProducts);
      saveToLocalStorage(newProducts);
    }
  };

  const categories = [
    'Digital Art',
    'Illustrations',
    '2D Assets',
    '3D Models',
    'Brushes & Tools',
    'Templates',
    'Music & Audio',
    'Stock Photos',
    'Fonts',
    'Other'
  ];

  const licenseOptions = [
    { value: 'personal', label: 'Personal Use', description: 'For personal projects only' },
    { value: 'commercial', label: 'Commercial Use', description: 'Use in commercial projects up to 10,000 sales' },
    { value: 'extended', label: 'Extended License', description: 'Unlimited commercial use + resell rights' }
  ];

  return (
    <Box>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1A6B8A">
            Digital Shop
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sell digital products. Buyers download instantly after purchase.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#4A9FBF', borderRadius: '8px', textTransform: 'none', px: 3 }}
        >
          Add Product
        </Button>
      </Box>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <BaseCard sx={{ textAlign: 'center', py: 8 }}>
          <ShopIcon sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>No products yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start selling your digital products
          </Typography>
          <Button variant="outlined" onClick={() => handleOpenDialog()} sx={{ borderColor: '#4A9FBF', color: '#4A9FBF', textTransform: 'none' }}>
            + Add Product
          </Button>
        </BaseCard>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <Box sx={{ position: 'relative', aspectRatio: '1/1', bgcolor: '#F0F9FF' }}>
                  {product.coverImage ? (
                    <img src={product.coverImage} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <ImageIcon sx={{ fontSize: 48, color: '#CBD5E1' }} />
                    </Box>
                  )}
                  <Chip label={product.license === 'personal' ? 'Personal' : product.license === 'commercial' ? 'Commercial' : 'Extended'} size="small" sx={{ position: 'absolute', top: 12, left: 12, bgcolor: '#1A6B8A', color: 'white' }} />
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="#4A9FBF" fontWeight={600}>{product.category}</Typography>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 0.5, mb: 0.5 }}>{product.title}</Typography>
                  <Typography variant="h6" fontWeight={800} color="#1A6B8A">Rp {product.price.toLocaleString('id-ID')}</Typography>
                  <Box display="flex" gap={1} sx={{ mt: 2 }}>
                    <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpenDialog(product)} sx={{ flex: 1, borderRadius: '8px', textTransform: 'none' }}>Edit</Button>
                    <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteProduct(product.id)} sx={{ borderRadius: '8px', textTransform: 'none' }}>Delete</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* DIALOG ADD/EDIT PRODUCT - TATA LETAK RAPI */}
      <Dialog open={openDialog} onClose={() => !loading && setOpenDialog(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: '16px', maxHeight: '90vh' } }}>

        <DialogTitle sx={{ borderBottom: '1px solid #E2E8F0', pb: 2 }}>
          <Typography variant="h6" fontWeight={700} color="#1A6B8A">
            {editingProduct ? 'Edit Product' : 'Add Digital Product'}
          </Typography>
          <IconButton onClick={() => setOpenDialog(false)} sx={{ position: 'absolute', right: 16, top: 12 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3, overflowY: 'auto' }}>
          {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}

          <Alert severity="info" sx={{ mb: 3, borderRadius: '8px' }}>
            💡 Digital products only. Buyers get instant download link after purchase.
          </Alert>

          {/* BASIC INFORMATION */}
          <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" sx={{ mb: 2 }}>Basic Information</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Product Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} label="Category">
                  {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe what buyers will get..." />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* PRICING & LICENSE */}
          <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" sx={{ mb: 2 }}>Pricing & License</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Price (Rp)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || '' })} InputProps={{ startAdornment: <InputAdornment position="start">Rp</InputAdornment> }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} helperText="Set 0 for unlimited" />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>License Type</InputLabel>
                <Select value={formData.license} onChange={(e) => setFormData({ ...formData, license: e.target.value })} label="License Type">
                  {licenseOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label} - {opt.description}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* MEDIA & FILES */}
          <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" sx={{ mb: 2 }}>Media & Files</Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <ImageUploadField label="Cover Image" value={formData.coverImage} onChange={(val) => setFormData({ ...formData, coverImage: val })} />
            </Grid>
            <Grid item xs={12}>
              <ImageUploadField label="Sample Images (Optional)" value={formData.sampleImages} onChange={(val) => setFormData({ ...formData, sampleImages: val })} multiple />
            </Grid>
            <Grid item xs={12}>
              <FileUploadField label="Digital File (ZIP, PNG, JPG, PDF, MP4)" value={formData.digitalFile} onChange={(val) => setFormData({ ...formData, digitalFile: val })} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* TAGS */}
          <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" sx={{ mb: 2 }}>Tags</Typography>
          <Box display="flex" gap={1} mb={2}>
            <TextField size="small" placeholder="e.g., illustration, character" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddTag()} fullWidth />
            <Button variant="outlined" onClick={handleAddTag}>Add Tag</Button>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {formData.tags.map((tag, idx) => (
              <Chip key={idx} label={tag} onDelete={() => handleRemoveTag(tag)} variant="outlined" />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setOpenDialog(false)} color="error" variant="outlined">Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained" sx={{ bgcolor: '#4A9FBF' }} disabled={loading}>
            {loading ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Publish Product')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShopManager;