import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import PortfolioManager from './PortfolioManager';
import CommissionManager from './CommissionManager';

export default function ArtistDashboardTab() {
  const [activeTab, setActiveTab] = useState(0);

  // Polimorfisme: Merender isi konten yang berbeda pada satu container berdasarkan indeks tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <PortfolioManager />;
      case 1:
        return <CommissionManager />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(74, 159, 191, 0.15)', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, color: '#64748B' },
            '& .Mui-selected': { color: '#4A9FBF !important' },
            '& .MuiTabs-indicator': { bgcolor: '#4A9FBF' }
          }}
        >
          <Tab label="📁 Kelola Portofolio" />
          <Tab label="💰 Atur Komisi & Harga" />
        </Tabs>
      </Box>
      <Box>{renderTabContent()}</Box>
    </Box>
  );
}