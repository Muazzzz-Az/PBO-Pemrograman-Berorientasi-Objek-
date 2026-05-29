// src/components/artist/ArtistDashboardTab.js
import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import PortfolioManager from './PortofolioManager';
import CommisionManager from './CommisionManager';

export default function ArtistDashboardTab() {
  const [activeTab, setActiveTab] = useState(0);

  // Fungsi render konten berdasarkan tab aktif
  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <PortfolioManager />;
      case 1:
        return <CommisionManager />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* TAB UTAMA: Portfolio | Commissions | Shop | Analytics */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        variant="fullWidth"
        sx={{
          borderBottom: '1px solid #E2E8F0',
          mb: 4,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            py: 1.5,
            color: '#64748B',
            '&.Mui-selected': { color: '#4A9FBF' },
          },
          '& .MuiTabs-indicator': { backgroundColor: '#4A9FBF', height: 2 },
        }}
      >
        <Tab label="Portfolio" />
        <Tab label="Commissions" />
      </Tabs>

      {/* Konten sesuai tab */}
      {renderContent()}
    </Box>
  );
}