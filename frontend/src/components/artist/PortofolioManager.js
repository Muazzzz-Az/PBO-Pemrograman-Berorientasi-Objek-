import React, { useState, useRef } from 'react';
import { Box, Typography, Button, Grid, IconButton, TextField } from '@mui/material';
import { Add as AddIcon, DeleteOutlined as DeleteIcon, PhotoCamera } from '@mui/icons-material';
import BaseCard from './BaseCard';

export default function PortfolioManager() {
  const [items, setItems] = useState([]);
  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItems([...items, { id: Date.now(), src: reader.result, title: '' }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleChange = (id, text) => {
    setItems(items.map(item => item.id === id ? { ...item, title: text } : item));
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={700} color="#1A6B8A">Galeri Portofolio Anda</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => fileInputRef.current.click()}
          sx={{ bgcolor: '#4A9FBF', borderRadius: '20px', textTransform: 'none' }}
        >
          Unggah Karya
        </Button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleUpload} />
      </Box>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={4} key={item.id}>
            <BaseCard sx={{ p: 1.5 }}>
              <Box sx={{ width: '100%', height: '160px', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                <img src={item.src} alt="Portofolio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <IconButton
                  onClick={() => handleDelete(item.id)}
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)', color: '#EF4444', '&:hover': { bgcolor: '#FFF' } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              <TextField
                placeholder="Berikan judul karya..."
                size="small"
                fullWidth
                value={item.title}
                onChange={(e) => handleTitleChange(item.id, e.target.value)}
                sx={{ mt: 1.5, '& .MuiOutlinedInput-root': { fontSize: '0.85rem', borderRadius: '8px' } }}
              />
            </BaseCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}