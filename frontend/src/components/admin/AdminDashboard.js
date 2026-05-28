import React, { useState } from 'react';
import { Container, Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import ArtistVerification from './ArtistVerification';
import WebManagement from './WebManagement';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', pt: 4, pb: 8 }}>
      <Container maxWidth="lg">
        {/* Header Dashboard */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A6B8A', letterSpacing: '-0.5px' }}>
            Creartsl Admin Panel
          </Typography>
          <Typography variant="body2" sx={{ color: '#4A9FBF', fontWeight: 500 }}>
            Panel kendali rahasia manajemen platform komisi seni
          </Typography>
        </Box>

        {/* Bar Navigasi Tab */}
        <Paper sx={{ borderRadius: '12px', mb: 4, boxShadow: '0 4px 15px rgba(74, 159, 191, 0.1)' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': { bgcolor: '#1A6B8A', height: '3px' },
              '& .MuiTab-root': { fontWeight: 700, fontSize: '0.95rem', color: '#64748B', textTransform: 'none' },
              '& .Mui-selected': { color: '#1A6B8A !important' }
            }}
          >
            <Tab label="Verifikasi Artist" />
            <Tab label="Manajemen Web" />
          </Tabs>
        </Paper>

        {/* Konten Tab Aktif */}
        <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', bgcolor: '#FFFFFF' }}>
          {activeTab === 0 && <ArtistVerification />}
          {activeTab === 1 && <WebManagement />}
        </Paper>
      </Container>
    </Box>
  );
}

export default AdminDashboard;