// src/components/admin/AdminPostManager.js
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button,
  Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Avatar, Stack, Divider, Tab, Tabs, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';

const SHOP_PRODUCTS_KEY = 'creartsi_shop_products';
const COMMISSIONS_KEY = 'creartsi_artist_commissions';
const PORTFOLIO_KEY = 'creartsi_artist_portfolio';

function AdminPostManager() {
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load shop products
    const savedProducts = JSON.parse(localStorage.getItem(SHOP_PRODUCTS_KEY) || '[]');
    setProducts(savedProducts);

    // Load commissions
    const savedCommissions = JSON.parse(localStorage.getItem(COMMISSIONS_KEY) || '[]');
    setCommissions(savedCommissions);

    // Load portfolios
    const savedPortfolios = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || '[]');
    setPortfolios(savedPortfolios);

    // Load all users
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    setAllUsers(users);
  };

  const getUserName = (userId) => {
    const user = allUsers.find(u => u.id === userId);
    return user?.fullName || user?.username || `User ${userId}`;
  };

  const handleDelete = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      let updated;
      if (type === 'product') {
        updated = products.filter(p => p.id !== id);
        localStorage.setItem(SHOP_PRODUCTS_KEY, JSON.stringify(updated));
        setProducts(updated);
      } else if (type === 'commission') {
        updated = commissions.filter(c => c.id !== id);
        localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(updated));
        setCommissions(updated);
      } else if (type === 'portfolio') {
        updated = portfolios.filter(p => p.id !== id);
        localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(updated));
        setPortfolios(updated);
      }
      alert(`✅ ${type} deleted successfully!`);
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleViewDetails = (item, type) => {
    setSelectedItem({ ...item, type });
    setOpenDialog(true);
  };

  const ProductCard = ({ product }) => (
    <Card sx={{ borderRadius: '16px', mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" color="#4A9FBF">Product</Typography>
            <Typography variant="subtitle1" fontWeight={700}>{product.title}</Typography>
            <Typography variant="body2" color="text.secondary">Artist: {product.artistName}</Typography>
            <Typography variant="h6" color="#1A6B8A">Rp {product.price?.toLocaleString('id-ID')}</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton color="error" onClick={() => handleDelete('product', product.id)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  const CommissionCard = ({ commission }) => (
    <Card sx={{ borderRadius: '16px', mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" color="#4A9FBF">Commission</Typography>
            <Typography variant="subtitle1" fontWeight={700}>{commission.title}</Typography>
            <Typography variant="body2" color="text.secondary">Artist: {commission.artistName}</Typography>
            <Typography variant="h6" color="#1A6B8A">Rp {commission.priceFrom?.toLocaleString('id-ID')}</Typography>
            <Chip
              label={commission.isOpen ? 'Open' : 'Closed'}
              size="small"
              color={commission.isOpen ? 'success' : 'error'}
              sx={{ mt: 1 }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton color="error" onClick={() => handleDelete('commission', commission.id)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  const PortfolioCard = ({ item }) => (
    <Card sx={{ borderRadius: '16px', mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" color="#4A9FBF">Portfolio</Typography>
            <Typography variant="subtitle1" fontWeight={700}>{item.title}</Typography>
            <Typography variant="body2" color="text.secondary">Artist: {item.artistName || 'Unknown'}</Typography>
            {item.medium && <Typography variant="caption" color="text.secondary">{item.medium}</Typography>}
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton color="error" onClick={() => handleDelete('portfolio', item.id)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h6" fontWeight={800} color="#1A6B8A" sx={{ mb: 3 }}>
        Manage All Posts
      </Typography>

      <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
        As an admin, you can delete any post from any user. This action cannot be undone.
      </Alert>

      <Tabs
        value={activeTab}
        onChange={(e, newVal) => setActiveTab(newVal)}
        sx={{ mb: 3, borderBottom: '1px solid #E2E8F0' }}
      >
        <Tab label={`Shop (${products.length})`} />
        <Tab label={`Commissions (${commissions.length})`} />
        <Tab label={`Portfolio (${portfolios.length})`} />
      </Tabs>

      {activeTab === 0 && (
        products.length === 0 ? (
          <Typography color="text.secondary">No products found</Typography>
        ) : (
          products.map(product => <ProductCard key={product.id} product={product} />)
        )
      )}

      {activeTab === 1 && (
        commissions.length === 0 ? (
          <Typography color="text.secondary">No commissions found</Typography>
        ) : (
          commissions.map(commission => <CommissionCard key={commission.id} commission={commission} />)
        )
      )}

      {activeTab === 2 && (
        portfolios.length === 0 ? (
          <Typography color="text.secondary">No portfolio items found</Typography>
        ) : (
          portfolios.map(item => <PortfolioCard key={item.id} item={item} />)
        )
      )}

      {/* Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Post Details</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
              {JSON.stringify(selectedItem, null, 2)}
            </pre>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPostManager;
