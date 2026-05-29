// src/components/artist/PortofolioManager.js
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
  ImageListItemBar
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutlined as DeleteIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Edit as EditIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import BaseCard from './BaseCard';

const PORTFOLIO_KEY = 'creartsi_artist_portfolio';

export default function PortfolioManager() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(PORTFOLIO_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
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
      alert('Upload gambar karya terlebih dahulu!');
      return;
    }
    if (!formData.title) {
      alert('Judul karya wajib diisi!');
      return;
    }

    let newItems;
    if (editingItem) {
      newItems = items.map(item =>
        item.id === editingItem.id ? { ...editingItem, ...formData } : item
      );
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        likes: 0,
        views: 0
      };
      newItems = [newItem, ...items];
    }

    saveToLocalStorage(newItems);
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus karya ini dari portofolio?')) {
      const newItems = items.filter(item => item.id !== id);
      saveToLocalStorage(newItems);
    }
  };

  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1A6B8A">
            🎨 Galeri Portofolio
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tampilkan karya seni terbaikmu. Upload gambar, beri judul, deskripsi, dan tags.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#4A9FBF', borderRadius: '12px', textTransform: 'none' }}
        >
          + Unggah Karya
        </Button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
      </Box>

      {items.length === 0 ? (
        <BaseCard sx={{ textAlign: 'center', py: 8 }}>
          <UploadIcon sx={{ fontSize: 60, color: '#CBD5E1', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Belum ada karya di portofolio
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Unggah karya pertamamu untuk menarik klien
          </Typography>
          <Button
            variant="outlined"
            onClick={() => handleOpenDialog()}
            sx={{ borderColor: '#4A9FBF', color: '#4A9FBF' }}
          >
            + Unggah Karya
          </Button>
        </BaseCard>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <Box sx={{ position: 'relative', pt: '75%', overflow: 'hidden', cursor: 'pointer' }} onClick={() => handlePreview(item.imageUrl)}>
                  <CardMedia
                    component="img"
                    image={item.imageUrl}
                    alt={item.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  {item.medium && (
                    <Typography variant="caption" color="#4A9FBF" sx={{ display: 'block', mb: 1 }}>
                      {item.medium} • {item.year}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, overflow: 'hidden' }}>
                    {item.description || ''}
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {item.tags?.slice(0, 3).map((tag, idx) => (
                      <Chip key={idx} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                    ))}
                    {item.tags?.length > 3 && (
                      <Chip label={`+${item.tags.length - 3}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0, bgcolor: '#000', display: 'flex', justifyContent: 'center' }}>
          <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
        </DialogContent>
      </Dialog>

      {/* Dialog Add/Edit Karya */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700} color="#1A6B8A">
            {editingItem ? '✏️ Edit Karya' : '📤 Unggah Karya Baru'}
          </Typography>
          <IconButton onClick={() => setOpenDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Image Upload */}
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
                mb: 2,
                bgcolor: '#F8FAFC',
                '&:hover': { borderColor: '#4A9FBF' }
              }}
            >
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
              ) : (
                <>
                  <UploadIcon sx={{ fontSize: 40, color: '#94A3B8' }} />
                  <Typography variant="body2" color="text.secondary">Klik untuk upload gambar</Typography>
                </>
              )}
            </Box>

            <TextField
              fullWidth
              label="Judul Karya *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Media / Teknik"
                  value={formData.medium}
                  onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  placeholder="Contoh: Digital Painting, Watercolor, Oil"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tahun"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Deskripsi Karya"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ceritakan tentang karya ini, inspirasi, atau proses pembuatannya..."
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" fontWeight={600} mb={1}>Tags / Kategori Karya</Typography>
            <Box display="flex" gap={1} alignItems="center" mb={1}>
              <TextField
                size="small"
                placeholder="Contoh: portrait, fantasy, anime"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                sx={{ flex: 1 }}
              />
              <Button variant="outlined" onClick={handleAddTag}>Tambah</Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.tags.map((tag, idx) => (
                <Chip key={idx} label={tag} onDelete={() => handleRemoveTag(tag)} size="small" />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="error" variant="outlined">Batal</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#4A9FBF' }}>Simpan</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}