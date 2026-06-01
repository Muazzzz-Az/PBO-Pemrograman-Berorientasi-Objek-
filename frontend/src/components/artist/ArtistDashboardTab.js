// src/components/artist/ArtistDashboardTab.js
import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import PortfolioManager from './PortfolioManager';
import CommissionManager from './CommissionManager';
import ShopManager from './ShopManager';

export default function ArtistDashboardTab() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <PortfolioManager />;
      case 1:
        return <CommissionManager />;
      case 2:
        return <ShopManager user={currentUser} />;
      default:
        return null;
    }
  };

  if (!currentUser) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

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
            fontSize: '0.9rem',
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
        <Tab label="Portfolio" />
        <Tab label="Commissions" />
      </Tabs>

      {renderContent()}
    </Box>
  );
}