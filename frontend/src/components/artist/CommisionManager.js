import React, { useState } from 'react';
import { Box, Typography, Button, Switch, TextField, InputAdornment, Stack, Divider } from '@mui/material';
import { Add as AddIcon, DeleteOutlined as DeleteIcon, PaletteOutlined } from '@mui/icons-material';
import BaseCard from './BaseCard';

export default function CommissionManager() {
  const [commissions, setCommissions] = useState([]);

  const handleAddSlot = () => {
    setCommissions([...commissions, { id: Date.now(), name: '', price: '', isOpen: true }]);
  };

  const handleChange = (id, field, value) => {
    setCommissions(commissions.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleDelete = (id) => {
    setCommissions(commissions.filter(c => c.id !== id));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={700} color="#1A6B8A">Atur Layanan Komisi (Ala VGen)</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddSlot}
          sx={{ bgcolor: '#4A9FBF', borderRadius: '20px', textTransform: 'none' }}
        >
          Tambah Slot Komisi
        </Button>
      </Box>

      <Stack spacing={2.5}>
        {commissions.map((comm) => (
          <BaseCard key={comm.id}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <PaletteOutlined sx={{ color: '#4A9FBF' }} />
                <Typography variant="subtitle1" fontWeight={700} color="#1A6B8A">Detail Paket Komisi</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body2" fontWeight={600} color="#64748B">
                  {comm.isOpen ? "🟢 Open" : "🔴 Closed"}
                </Typography>
                <Switch
                  checked={comm.isOpen}
                  onChange={(e) => handleChange(comm.id, 'isOpen', e.target.checked)}
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#4A9FBF' } }}
                />
                <IconButton onClick={() => handleDelete(comm.id)} sx={{ color: '#EF4444' }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            <Divider sx={{ mb: 2, borderColor: '#F0F9FF' }} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Nama Jenis Komisi (Contoh: Bust Up / Chibi)"
                fullWidth
                size="small"
                value={comm.name}
                onChange={(e) => handleChange(comm.id, 'name', e.target.value)}
              />
              <TextField
                label="Harga Dasar"
                size="small"
                type="number"
                value={comm.price}
                onChange={(e) => handleChange(comm.id, 'price', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                }}
                sx={{ width: { sm: '250px' } }}
              />
            </Stack>
          </BaseCard>
        ))}
      </Stack>
    </Box>
  );
}