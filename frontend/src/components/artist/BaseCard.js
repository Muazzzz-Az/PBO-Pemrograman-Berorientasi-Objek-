import React from 'react';
import { Box } from '@mui/material';

// Mewariskan struktur desain dasar pastel khas CreartsI
export default function BaseCard({ children, sx, ...props }) {
  return (
    <Box
      {...props}
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: '16px',
        p: 3,
        border: '1px solid rgba(74, 159, 191, 0.15)',
        boxShadow: '0 4px 20px rgba(74, 159, 191, 0.03)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 25px rgba(74, 159, 191, 0.08)',
        },
        ...sx
      }}
    >
      {children}
    </Box>
  );
}