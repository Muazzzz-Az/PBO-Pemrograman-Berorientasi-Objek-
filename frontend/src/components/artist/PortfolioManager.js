// src/components/artist/PortfolioManager.js
import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardMedia,
  CardContent,
  Chip,
  ImageList,
  ImageListItem,
  Alert,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutlined as DeleteIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import BaseCard from './BaseCard';
import toast from 'react-hot-toast';

const PORTFOLIO_KEY = 'creartsi_artist_portfolio';

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
};

const compressImage = (base64Str, maxWidth = 800, maxHeight = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

const PortfolioManager = () => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(PORTFOLIO_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    tags: [],
    medium: '',
    year: new Date().getFullYear()
  });
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef(null);

  const saveToLocalStorage = (data) => {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(data));
    setItems(data);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const compressed = await compressImage(base64);
      setFormData({ ...formData, imageUrl: compressed });
    } catch (error) {
      toast.error('Failed to upload image');
    }
    setLoading(false);
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

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        tags: item.tags || [],
        medium: item.medium || '',
        year: item.year || new Date().getFullYear()
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        tags: [],
        medium: '',
        year: new Date().getFullYear()
      });
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.imageUrl) {
      toast.error('Please upload an image');
      return;
    }
    if (!formData.title) {
      toast.error('Please enter artwork title');
      return;
    }

    let newItems;
    if (editingItem) {
      newItems = items.map(item =>
        item.id === editingItem.id ? { ...editingItem, ...formData, updatedAt: new Date().toISOString() } : item
      );
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      newItems = [newItem, ...items];
    }

    saveToLocalStorage(newItems);
    setOpenDialog(false);
    toast.success(editingItem ? 'Artwork updated successfully!' : 'Artwork added to portfolio!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this artwork from portfolio?')) {
      saveToLocalStorage(items.filter(item => item.id !== id));
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1A6B8A">
            Portfolio Gallery
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showcase your best artwork to attract clients
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#4A9FBF', borderRadius: '8px', textTransform: 'none' }}
        >
          Add Artwork
        </Button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
      </Box>

      {/* Empty State */}
      {items.length === 0 ? (
        <BaseCard sx={{ textAlign: 'center', py: 8 }}>
          <UploadIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No artwork yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload your first artwork to showcase your talent
          </Typography>
          <Button
            variant="outlined"
            onClick={() => handleOpenDialog()}
            sx={{ borderColor: '#4A9FBF', color: '#4A9FBF', textTransform: 'none' }}
          >
            + Add Artwork
          </Button>
        </BaseCard>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ borderRadius: '12px', overflow: 'hidden', height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <Box sx={{ position: 'relative', aspectRatio: '1/1', cursor: 'pointer' }} onClick={() => setPreviewImage(item.imageUrl)}>
                  <CardMedia
                    component="img"
                    image={item.imageUrl}
                    alt={item.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  {item.medium && (
                    <Typography variant="caption" color="#4A9FBF" sx={{ display: 'block', mb: 1 }}>
                      {item.medium} • {item.year}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, overflow: 'hidden' }}>
                    {item.description}
                  </Typography>
                  {item.tags?.length > 0 && (
                    <Box display="flex" flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <Chip key={idx} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0, bgcolor: '#000', display: 'flex', justifyContent: 'center', minHeight: '300px' }}>
          <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
        </DialogContent>
        <IconButton onClick={() => setPreviewImage(null)} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '16px', maxHeight: '90vh' } }}>

        <DialogTitle sx={{ borderBottom: '1px solid #E2E8F0', pb: 2 }}>
          <Typography variant="h6" fontWeight={700} color="#1A6B8A">
            {editingItem ? 'Edit Artwork' : 'Add New Artwork'}
          </Typography>
          <IconButton onClick={() => setOpenDialog(false)} sx={{ position: 'absolute', right: 16, top: 12 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3, overflowY: 'auto' }}>
          {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}

          <Alert severity="info" sx={{ mb: 3, borderRadius: '8px' }}>
            Upload your artwork here. Supported formats: JPG, PNG, GIF, WebP
          </Alert>

          {/* Image Upload Area */}
          <Box
            onClick={() => fileInputRef.current.click()}
            sx={{
              width: '100%',
              height: 200,
              border: '2px dashed #CBD5E1',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              mb: 3,
              bgcolor: '#F8FAFC',
              '&:hover': { borderColor: '#4A9FBF', bgcolor: '#F0F9FF' }
            }}
          >
            {formData.imageUrl ? (
              <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
            ) : (
              <>
                <UploadIcon sx={{ fontSize: 40, color: '#94A3B8' }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Click to upload image</Typography>
                <Typography variant="caption" color="text.secondary">JPG, PNG, GIF, WebP</Typography>
              </>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Artwork Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Medium / Technique"
                value={formData.medium}
                onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                placeholder="Digital Painting, Watercolor, etc"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your artwork, inspiration, or process..."
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={600} mb={1}>Tags</Typography>
              <Box display="flex" gap={1} mb={1}>
                <TextField
                  size="small"
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  fullWidth
                />
                <Button variant="outlined" onClick={handleAddTag}>Add</Button>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {formData.tags.map((tag, idx) => (
                  <Chip key={idx} label={tag} onDelete={() => handleRemoveTag(tag)} size="small" />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setOpenDialog(false)} color="error" variant="outlined">Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#4A9FBF' }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PortfolioManager;