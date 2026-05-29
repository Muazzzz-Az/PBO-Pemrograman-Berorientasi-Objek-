// src/components/artist/ArtistDashboardTab.js
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import PortfolioManager from './PortofolioManager';
import CommisionManager from './CommisionManager';
import ShopManager from './ShopManager';
import AnalyticsTab from './AnalyticsTab';

export default function ArtistDashboardTab() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        variant="fullWidth"
        sx={{
          borderBottom: '2px solid #E2E8F0',
          mb: 4,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            py: 2,
            color: '#64748B',
            '&.Mui-selected': {
              color: '#4A9FBF',
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#4A9FBF',
            height: 3,
            borderRadius: '3px',
          },
        }}
      >
        <Tab label="📦 Portofolio & Komisi" />
        <Tab label="🛍️ Toko" />
        <Tab label="📊 Analytics" />
      </Tabs>

      <Box>
        {activeTab === 0 && <PortfolioCommissionView />}
        {activeTab === 1 && <ShopManager />}
        {activeTab === 2 && <AnalyticsTab />}
      </Box>
    </Box>
  );
}

// Komponen terpisah untuk Portofolio & Komisi
function PortfolioCommissionView() {
  const [subTab, setSubTab] = useState(0);

  // Debug: cek apakah komponen ada
  console.log('PortfolioManager:', PortfolioManager);
  console.log('CommisionManager:', CommisionManager);

  const renderContent = () => {
    if (subTab === 0) {
      return <PortfolioManager />;
    } else {
      return <CommisionManager />;
    }
  };

  return (
    <Box>
      <Tabs
        value={subTab}
        onChange={(e, newValue) => setSubTab(newValue)}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.9rem',
            minHeight: 40,
            color: '#94A3B8',
            '&.Mui-selected': { color: '#4A9FBF' },
          },
          '& .MuiTabs-indicator': { backgroundColor: '#4A9FBF' },
        }}
      >
        <Tab label="🎨 Portofolio" />
        <Tab label="💰 Paket Komisi" />
      </Tabs>

      {renderContent()}
    </Box>
  );
}