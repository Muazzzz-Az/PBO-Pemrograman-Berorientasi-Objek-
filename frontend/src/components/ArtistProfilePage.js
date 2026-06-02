// src/components/ArtistProfilePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Grid, Card, CardContent, Typography, Avatar, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Stack, CircularProgress, IconButton, Checkbox, FormControlLabel,
  Tabs, Tab, Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';
import VerifiedIcon from '@mui/icons-material/Verified';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import InventoryIcon from '@mui/icons-material/Inventory';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import StoreIcon from '@mui/icons-material/Store';
import PaletteIcon from '@mui/icons-material/Palette';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import userService from '../services/userService';
import { cartService } from '../services/RealTimeDataService';
import toast from 'react-hot-toast';

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const getArtistCommissions = () => {
  const saved = localStorage.getItem('creartsi_artist_commissions');
  return saved ? JSON.parse(saved) : [];
};

const getArtistPortfolio = () => {
  const saved = localStorage.getItem('creartsi_artist_portfolio');
  return saved ? JSON.parse(saved) : [];
};

const getShopProducts = () => {
  const saved = localStorage.getItem('creartsi_shop_products');
  return saved ? JSON.parse(saved) : [];
};

// Cari artist berdasarkan ID atau Username
const findArtist = (identifier) => {
  const asId = parseInt(identifier);
  if (!isNaN(asId)) {
    const byId = userService.getUserById(asId);
    if (byId) return byId;

    // Fallback: Cari di commissions apakah ada artistId ini, lalu cari berdasarkan artistName-nya
    const allCommissions = getArtistCommissions();
    const matchingComm = allCommissions.find(c => c.artistId === asId);
    if (matchingComm && matchingComm.artistName) {
      const byName = userService.getUserByUsername(matchingComm.artistName);
      if (byName) return byName;
    }
  }

  const byUsername = userService.getUserByUsername(identifier);
  if (byUsername) return byUsername;

  return null;
};

const getArtistAllContent = (artistId, artistName, artistUsername) => {
  const artistIdNum = parseInt(artistId);

  const allCommissions = getArtistCommissions();
  const commissions = allCommissions.filter(c => {
    // Match by numeric ID
    if (c.artistId && artistIdNum && Number(c.artistId) === artistIdNum) return true;
    // Match by fullName
    if (artistName && c.artistName === artistName) return true;
    // Match by username
    if (artistUsername && c.artistName === artistUsername) return true;
    return false;
  });

  const allPortfolio = getArtistPortfolio();
  const portfolios = allPortfolio.filter(p => {
    if (p.artistId && artistIdNum && Number(p.artistId) === artistIdNum) return true;
    if (artistName && p.artistName === artistName) return true;
    if (artistUsername && p.artistName === artistUsername) return true;
    return false;
  });

  const allProducts = getShopProducts();
  const products = allProducts.filter(p => {
    if (p.artistId && artistIdNum && Number(p.artistId) === artistIdNum) return true;
    if (artistName && p.artistName === artistName) return true;
    if (artistUsername && p.artistName === artistUsername) return true;
    return false;
  });

  return { commissions, portfolios, products };
};

// ==========================================
// REQUEST MODAL
// ==========================================
const RequestModal = ({ open, onClose, commission, artist, currentUser }) => {
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [requestData, setRequestData] = useState({
    email: currentUser?.email || '',
    usage: '',
    references: '',
    agreeTerms: false
  });

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({ id: Date.now(), name: file.name }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const handleSubmit = () => {
    if (!requestData.agreeTerms) {
      toast.error('Please agree to Terms of Service');
      return;
    }
    setSubmitting(true);

    setTimeout(() => {
      const newRequest = {
        id: Date.now(),
        commissionId: commission?.id,
        artistId: artist?.id,
        artistName: artist?.fullName,
        buyerId: currentUser.id,
        buyerName: currentUser.fullName,
        usage: requestData.usage,
        references: requestData.references,
        files: uploadedFiles,
        commissionTitle: commission?.title,
        commissionPrice: commission?.priceFrom,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const requests = JSON.parse(localStorage.getItem('commission_requests') || '[]');
      requests.push(newRequest);
      localStorage.setItem('commission_requests', JSON.stringify(requests));

      const artistNotifs = JSON.parse(localStorage.getItem(`artist_notifications_${artist?.id}`) || '[]');
      artistNotifs.unshift({
        id: Date.now(),
        type: 'NEW_COMMISSION_REQUEST',
        title: 'New Request',
        message: `${currentUser.fullName} requested "${commission?.title}"`,
        isRead: false,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(`artist_notifications_${artist?.id}`, JSON.stringify(artistNotifs));

      // 🔥 REMOVE FROM CART: Hapus commission ini dari cart/wishlist
      const cart = JSON.parse(localStorage.getItem('creartsi_cart') || '[]');
      const updatedCart = cart.filter(item => 
        !(item.commissionId === commission?.id && item.userId === currentUser.id)
      );
      localStorage.setItem('creartsi_cart', JSON.stringify(updatedCart));

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      setSubmitting(false);
      toast.success('Request submitted!');
      onClose();
    }, 1000);
  };

  if (!commission) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#4A9FBF', color: 'white' }}>
        Request: {commission.title}
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ mb: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">Price</Typography>
          <Typography variant="h5" fontWeight={800} color="#1A6B8A">Rp {commission.priceFrom?.toLocaleString('id-ID')}</Typography>
        </Box>

        <TextField fullWidth label="Email" value={requestData.email} onChange={(e) => setRequestData({...requestData, email: e.target.value})} sx={{ mb: 2 }} />

        <TextField select fullWidth label="Usage Type" value={requestData.usage} onChange={(e) => setRequestData({...requestData, usage: e.target.value})} sx={{ mb: 2 }}>
          <MenuItem value="personal">Personal Use</MenuItem>
          <MenuItem value="commercial">Commercial Use</MenuItem>
        </TextField>

        <TextField fullWidth multiline rows={3} label="References / Description" value={requestData.references} onChange={(e) => setRequestData({...requestData, references: e.target.value})} sx={{ mb: 2 }} />

        <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} sx={{ mb: 1 }}>
          Upload Files
          <input type="file" hidden multiple onChange={handleFileUpload} />
        </Button>
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {uploadedFiles.map((file) => (
            <Chip key={file.id} label={file.name} onDelete={() => removeFile(file.id)} size="small" />
          ))}
        </Box>

        <FormControlLabel control={<Checkbox checked={requestData.agreeTerms} onChange={(e) => setRequestData({...requestData, agreeTerms: e.target.checked})} />} label="I agree to Terms of Service" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!requestData.usage || !requestData.agreeTerms || submitting} sx={{ bgcolor: '#4A9FBF' }}>
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
function ArtistProfilePage() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [commissions, setCommissions] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const currentUser = userService.getCurrentUser();

  const loadData = async () => {
    setLoading(true);

    let artistData = findArtist(artistId);
    console.log('Looking for:', artistId, 'Found:', artistData);

    if (!artistData) {
      try {
        const asId = parseInt(artistId);
        if (!isNaN(asId)) {
          const response = await fetch(`http://localhost:8080/api/users/${asId}`);
          if (response.ok) {
            const data = await response.json();
            if (data) {
              artistData = {
                id: data.id,
                username: data.username,
                email: data.email,
                fullName: data.fullName,
                role: data.role || 'artist',
                isVerified: data.isVerified === true,
                bio: data.bio || 'Artist on CreartsI',
                avatarUrl: data.avatarUrl || null,
                createdAt: data.createdAt || new Date().toISOString()
              };
              
              // Sync to registered_users
              const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
              if (!registeredUsers.some(u => u.id === artistData.id)) {
                registeredUsers.push(artistData);
                localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
              }
            }
          } else {
            // ID fetch failed, try loading all users and searching by matching name from commissions
            const allCommissions = getArtistCommissions();
            const matchingComm = allCommissions.find(c => c.artistId === asId);
            if (matchingComm && matchingComm.artistName) {
              const allUsersResponse = await fetch('http://localhost:8080/api/users/all');
              if (allUsersResponse.ok) {
                const users = await allUsersResponse.json();
                const foundUser = users.find(u => u.username === matchingComm.artistName || u.fullName === matchingComm.artistName);
                if (foundUser) {
                  artistData = {
                    id: foundUser.id,
                    username: foundUser.username,
                    email: foundUser.email,
                    fullName: foundUser.fullName,
                    role: foundUser.role || 'artist',
                    isVerified: foundUser.isVerified === true,
                    bio: foundUser.bio || 'Artist on CreartsI',
                    avatarUrl: foundUser.avatarUrl || null,
                    createdAt: foundUser.createdAt || new Date().toISOString()
                  };
                  
                  // Sync to registered_users
                  const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
                  if (!registeredUsers.some(u => u.id === artistData.id)) {
                    registeredUsers.push(artistData);
                    localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
                  }
                }
              }
            }
          }
        } else {
          const response = await fetch('http://localhost:8080/api/users/all');
          if (response.ok) {
            const users = await response.json();
            const foundUser = users.find(u => u.username === artistId || u.fullName === artistId);
            if (foundUser) {
              artistData = {
                id: foundUser.id,
                username: foundUser.username,
                email: foundUser.email,
                fullName: foundUser.fullName,
                role: foundUser.role || 'artist',
                isVerified: foundUser.isVerified === true,
                bio: foundUser.bio || 'Artist on CreartsI',
                avatarUrl: foundUser.avatarUrl || null,
                createdAt: foundUser.createdAt || new Date().toISOString()
              };
              
              // Sync to registered_users
              const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
              if (!registeredUsers.some(u => u.id === artistData.id)) {
                registeredUsers.push(artistData);
                localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching artist from backend:', error);
      }
    }

    if (artistData) {
      setArtist(artistData);
      
      // Debug: log what we're looking for
      console.log('Artist found:', { id: artistData.id, fullName: artistData.fullName, username: artistData.username });
      const allComms = JSON.parse(localStorage.getItem('creartsi_artist_commissions') || '[]');
      console.log('All commissions in storage:', allComms.map(c => ({ id: c.id, artistId: c.artistId, artistName: c.artistName, title: c.title })));
      
      const { commissions: comms, portfolios: ports, products: prods } = getArtistAllContent(
        artistData.id, 
        artistData.fullName,
        artistData.username
      );
      console.log('Matched commissions:', comms.length, comms);
      setCommissions(comms);
      setPortfolios(ports);
      setProducts(prods);
    } else {
      setArtist(null);
      setCommissions([]);
      setPortfolios([]);
      setProducts([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const handleDataChange = () => loadData();
    window.addEventListener('userUpdated', handleDataChange);
    window.addEventListener('storage', handleDataChange);
    window.addEventListener('commissionDataChanged', handleDataChange);
    window.addEventListener('shopDataChanged', handleDataChange);

    return () => {
      window.removeEventListener('userUpdated', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
      window.removeEventListener('commissionDataChanged', handleDataChange);
      window.removeEventListener('shopDataChanged', handleDataChange);
    };
  }, [artistId]);

  const handleRequest = (commission) => {
    if (!currentUser) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    setSelectedCommission(commission);
    setOpenModal(true);
  };

  const handleChat = () => {
    if (!currentUser) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    navigate(`/messages?userId=${artist?.id || artistId}`);
  };

  // ==========================================
  // FUNGSI ADD TO CART - DILETAKKAN DI SINI
  // ==========================================
  const handleAddToCart = (commission, e) => {
    e.stopPropagation();

    if (!currentUser) {
      toast.error('Please login first to add items to cart');
      navigate('/login');
      return;
    }

    const cartItem = {
      id: commission.id,
      commissionId: commission.id,
      title: commission.title,
      priceFrom: commission.priceFrom,
      price: commission.priceFrom,
      coverImage: commission.coverImage,
      artistName: commission.artistName || artist?.fullName,
      artistId: artist?.id,
      quantity: 1
    };

    const result = cartService.addToCart(cartItem, currentUser.id);
    if (result) {
      toast.success(`"${commission.title}" added to cart!`);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#4A9FBF' }} />
      </Box>
    );
  }

  if (!artist && commissions.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Artist not found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          Artist "{artistId}" tidak ditemukan di database.
        </Typography>
        <Button onClick={() => navigate('/artists')} variant="contained" sx={{ bgcolor: '#4A9FBF', borderRadius: 30 }}>
          Back to Artists
        </Button>
      </Container>
    );
  }

  const displayArtist = artist || {
    id: null,
    fullName: commissions[0]?.artistName || `Artist`,
    username: artistId,
    bio: commissions[0]?.description || 'No bio available',
    avatarUrl: null,
    isVerified: false,
    createdAt: new Date().toISOString()
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'MAY 2026';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }).toUpperCase();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', py: 4 }}>
      <Container maxWidth="lg">
        <Button onClick={() => navigate('/artists')} startIcon={<ArrowBackIcon />} sx={{ mb: 4, color: '#1A6B8A', fontWeight: 600 }}>
          Back to Artists
        </Button>

        <Card sx={{ borderRadius: '28px', p: 4, mb: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
            <Avatar
              src={displayArtist.avatarUrl}
              sx={{ width: 100, height: 100, border: '3px solid #4A9FBF', bgcolor: '#4A9FBF', fontSize: 40 }}
            >
              {displayArtist.fullName?.charAt(0).toUpperCase()}
            </Avatar>
            <Box flex={1}>
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                <Typography variant="h4" fontWeight={800} color="#1A6B8A">{displayArtist.fullName}</Typography>
                {displayArtist.isVerified && <VerifiedIcon sx={{ color: '#4A9FBF' }} />}
                <Chip label={`@${displayArtist.username}`} size="small" variant="outlined" />
              </Stack>
              <Typography variant="body1" sx={{ color: '#475569', mt: 1, mb: 2 }}>
                {displayArtist.bio || 'No bio yet'}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" startIcon={<ChatIcon />} onClick={handleChat} sx={{ bgcolor: '#4A9FBF', borderRadius: 30, textTransform: 'none' }}>
                  Message Artist
                </Button>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  JOINED {formatJoinDate(displayArtist.createdAt)}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Card>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            sx={{
              borderBottom: '1px solid #E2E8F0',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, py: 2 },
              '& .Mui-selected': { color: '#4A9FBF' },
              '& .MuiTabs-indicator': { bgcolor: '#4A9FBF' }
            }}
          >
            <Tab icon={<PaletteIcon />} iconPosition="start" label={`Portfolio (${portfolios.length})`} />
            <Tab icon={<AttachMoneyIcon />} iconPosition="start" label={`Commissions (${commissions.length})`} />
            <Tab icon={<StoreIcon />} iconPosition="start" label={`Shop (${products.length})`} />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* TAB 0: PORTFOLIO */}
            {activeTab === 0 && (
              portfolios.length === 0 ? (
                <Typography textAlign="center" color="text.secondary" py={4}>No portfolio items yet.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {portfolios.map((item) => (
                    <Grid item xs={6} sm={4} md={3} key={item.id}>
                      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ aspectRatio: '1/1', bgcolor: '#F1F5F9' }}>
                          <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography variant="body2" fontWeight={700} noWrap>{item.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.medium}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )
            )}

            {/* TAB 1: COMMISSIONS - DENGAN ADD TO CART */}
            {activeTab === 1 && (
              commissions.length === 0 ? (
                <Typography textAlign="center" color="text.secondary" py={4}>No commission packages yet.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {commissions.map((commission) => (
                    <Grid item xs={12} sm={6} key={commission.id}>
                      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                          <Box sx={{ width: { xs: '100%', sm: 120 }, height: 120, bgcolor: '#F1F5F9', flexShrink: 0 }}>
                            <img src={commission.coverImage} alt={commission.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </Box>
                          <CardContent sx={{ flex: 1, p: 2 }}>
                            <Chip label={commission.category} size="small" sx={{ bgcolor: '#E0F2FE', color: '#1A6B8A', mb: 1 }} />
                            <Typography variant="subtitle1" fontWeight={800}>{commission.title}</Typography>
                            <Typography variant="h6" fontWeight={800} color="#4A9FBF" sx={{ my: 1 }}>
                              Rp {commission.priceFrom?.toLocaleString('id-ID')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, overflow: 'hidden' }}>
                              {commission.description}
                            </Typography>

                            {/* TOMBOL ADD TO CART DAN REQUEST */}
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<AddShoppingCartIcon />}
                                onClick={(e) => handleAddToCart(commission, e)}
                                sx={{
                                  borderRadius: 20,
                                  textTransform: 'none',
                                  borderColor: '#4A9FBF',
                                  color: '#4A9FBF',
                                  flex: 1,
                                  '&:hover': { bgcolor: 'rgba(74, 159, 191, 0.05)' }
                                }}
                              >
                                Add to Cart
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleRequest(commission)}
                                disabled={!commission.isOpen}
                                sx={{
                                  bgcolor: '#4A9FBF',
                                  borderRadius: 20,
                                  textTransform: 'none',
                                  flex: 1,
                                  '&:disabled': { bgcolor: '#CBD5E1' }
                                }}
                              >
                                {commission.isOpen ? 'Request' : 'Closed'}
                              </Button>
                            </Stack>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )
            )}

            {/* TAB 2: SHOP */}
            {activeTab === 2 && (
              products.length === 0 ? (
                <Typography textAlign="center" color="text.secondary" py={4}>No shop products yet.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {products.map((product) => (
                    <Grid item xs={6} sm={4} md={3} key={product.id}>
                      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ aspectRatio: '1/1', bgcolor: '#F1F5F9' }}>
                          <img src={product.coverImage} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography variant="body2" fontWeight={700} noWrap>{product.title}</Typography>
                          <Typography variant="body1" fontWeight={800} color="#1A6B8A">Rp {product.price?.toLocaleString('id-ID')}</Typography>
                          <Button size="small" fullWidth variant="outlined" onClick={handleChat} sx={{ mt: 1, borderRadius: 20, borderColor: '#4A9FBF', color: '#4A9FBF' }}>
                            Chat to Buy
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )
            )}
          </Box>
        </Paper>
      </Container>

      <RequestModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        commission={selectedCommission}
        artist={displayArtist}
        currentUser={currentUser}
      />
    </Box>
  );
}

export default ArtistProfilePage;