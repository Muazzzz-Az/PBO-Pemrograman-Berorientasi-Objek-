// ArtistDetail.js - Fixed Version (Tampilan tetap sama, hanya chat yang diperbaiki)
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box, Container, Grid, Card, CardContent, Typography, Avatar, Chip, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Divider, Rating, Stack, Alert, Snackbar, CircularProgress,
  Checkbox, FormControlLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddLinkIcon from '@mui/icons-material/AddLink';
import VerifiedIcon from '@mui/icons-material/Verified';
import RealTimeChatBox from './RealTimeChatBox';

// ==========================================
// GET REAL DATA FROM LOCALSTORAGE
// ==========================================
const getArtistCommissions = () => {
  const saved = localStorage.getItem('creartsi_artist_commissions');
  return saved ? JSON.parse(saved) : [];
};

const getArtists = () => {
  const saved = localStorage.getItem('kreartsi_artists');
  return saved ? JSON.parse(saved) : [];
};

function ArtistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk data artist dan commission
  const [commission, setCommission] = useState(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Request Modal
  const [openRequest, setOpenRequest] = useState(false);
  const [requestStep, setRequestStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Chat Modal - HANYA INI YANG DIPERLUKAN
  const [openChat, setOpenChat] = useState(false);

  // Notifikasi
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!currentUser;

  // Request Form Data
  const [requestData, setRequestData] = useState({
    email: currentUser?.email || '',
    twitter: '', instagram: '', twitch: '', youtube: '',
    usage: '', commercialQuantity: 0, references: '', canStream: '',
    deadline: '', paymentMethod: '', extraInfo: '', agreeTerms: false
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedLinks, setUploadedLinks] = useState([]);
  const [newLink, setNewLink] = useState('');

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const requireLogin = () => {
    if (!isLoggedIn) {
      showNotification('Please login first to continue', 'warning');
      setTimeout(() => navigate('/login'), 1500);
      return false;
    }
    return true;
  };

  const handleOpenRequest = () => {
    if (!requireLogin()) return;
    setOpenRequest(true);
    setRequestStep(1);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const addLink = () => {
    if (newLink.trim()) {
      setUploadedLinks([...uploadedLinks, { id: Date.now(), url: newLink }]);
      setNewLink('');
    }
  };

  const removeLink = (id) => {
    setUploadedLinks(uploadedLinks.filter(l => l.id !== id));
  };

  const handleSubmitRequest = async () => {
    if (!requestData.agreeTerms) {
      showNotification('Please agree to the Terms of Service', 'warning');
      return;
    }

    setSubmitting(true);
    setRequestStep(2);

    setTimeout(() => {
      const newRequest = {
        id: Date.now(),
        commissionId: id,
        artistId: artist?.id || commission?.artistId,
        artistName: artist?.artistName || commission?.artistName,
        buyerId: currentUser.id,
        buyerName: currentUser.fullName,
        buyerEmail: requestData.email,
        socialMedia: { twitter: requestData.twitter, instagram: requestData.instagram, twitch: requestData.twitch, youtube: requestData.youtube },
        usage: requestData.usage,
        references: requestData.references,
        files: uploadedFiles,
        links: uploadedLinks,
        canStream: requestData.canStream,
        deadline: requestData.deadline,
        paymentMethod: requestData.paymentMethod,
        extraInfo: requestData.extraInfo,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const requests = JSON.parse(localStorage.getItem('commission_requests') || '[]');
      requests.push(newRequest);
      localStorage.setItem('commission_requests', JSON.stringify(requests));

      setSubmitting(false);
      setRequestStep(3);

      setTimeout(() => {
        setOpenRequest(false);
        setRequestStep(1);
        setRequestData({
          email: currentUser?.email || '',
          twitter: '', instagram: '', twitch: '', youtube: '',
          usage: '', commercialQuantity: 0, references: '', canStream: '',
          deadline: '', paymentMethod: '', extraInfo: '', agreeTerms: false
        });
        setUploadedFiles([]);
        setUploadedLinks([]);
        showNotification('Request submitted successfully!', 'success');
      }, 2000);
    }, 1500);
  };

  // LOAD DATA
  useEffect(() => {
    const loadData = () => {
      setLoading(true);

      const commissions = getArtistCommissions();
      const artists = getArtists();

      const foundCommission = commissions.find(c => c.id === parseInt(id));

      if (foundCommission) {
        setCommission(foundCommission);

        const foundArtist = artists.find(a =>
          a.name === foundCommission.artistName ||
          a.id === foundCommission.artistId
        );

        if (foundArtist) {
          setArtist(foundArtist);
        } else {
          setArtist({
            id: foundCommission.artistId || Date.now(),
            artistName: foundCommission.artistName || 'Artist',
            username: foundCommission.artistName?.toLowerCase().replace(/ /g, '') || 'artist',
            bio: foundCommission.description || 'Professional artist specializing in custom commissions.',
            rating: 4.9,
            totalReviews: 24,
            profilePicture: 'https://i.pravatar.cc/150?img=1',
            instagram: '',
            portfolio: '',
            defaultPrice: foundCommission.priceFrom || 500000
          });
        }
      } else {
        // Data dummy untuk testing
        setCommission({
          id: parseInt(id),
          title: 'Commission Package',
          category: 'Illustrations',
          description: 'Custom illustration service',
          priceFrom: 18000,
          priceTo: null,
          turnaround: '7-14 days',
          revisions: 2,
          slots: 5,
          slotsLeft: 5,
          isOpen: true,
          coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
          includes: ['Illustrations'],
          artistName: 'Nailum Studio',
          artistId: 1
        });

        setArtist({
          id: 1,
          artistName: 'Nailum Studio',
          username: 'nailumstudio',
          bio: 'Professional illustrator specializing in anime and fantasy art. Open for commissions!',
          rating: 5.0,
          totalReviews: 186,
          profilePicture: 'https://i.pravatar.cc/150?img=1',
          instagram: '@nailumstudio',
          portfolio: 'https://nailumstudio.com',
          defaultPrice: 18000
        });
      }

      setLoading(false);
    };

    loadData();
  }, [id]);

  if (loading || !commission || !artist) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress sx={{ color: '#4A9FBF' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button component={Link} to="/artists" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: '#1A6B8A', fontWeight: 600 }}>
        Back to Artists
      </Button>

      {/* Main Commission Detail Card */}
      <Grid container spacing={4}>
        {/* LEFT COLUMN - IMAGE */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '24px', overflow: 'hidden' }}>
            <Box sx={{ position: 'relative', pt: '100%', bgcolor: '#F1F5F9' }}>
              <img
                src={commission.coverImage}
                alt={commission.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <Chip
                label="OPEN"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  bgcolor: '#10B981',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: '20px'
                }}
              />
            </Box>
          </Card>
        </Grid>

        {/* RIGHT COLUMN - DETAILS */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '24px', p: 3 }}>
            <Typography variant="caption" sx={{ color: '#4A9FBF', fontWeight: 700, letterSpacing: '0.5px' }}>
              {commission.category}
            </Typography>

            <Typography variant="h4" fontWeight={800} sx={{ mt: 1, mb: 2, color: '#1A6B8A' }}>
              {commission.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              {commission.description || 'Professional custom artwork tailored to your needs.'}
            </Typography>

            {/* Price */}
            <Typography variant="body2" sx={{ color: '#64748B' }}>Starting from</Typography>
            <Typography variant="h3" fontWeight={800} sx={{ color: '#4A9FBF', mb: 3 }}>
              Rp {commission.priceFrom.toLocaleString('id-ID')}
            </Typography>

            {/* Details Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>Turnaround</Typography>
                <Typography variant="body2" fontWeight={600}>{commission.turnaround}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>Revisions</Typography>
                <Typography variant="body2" fontWeight={600}>{commission.revisions} times</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>Slots Left</Typography>
                <Typography variant="body2" fontWeight={600}>{commission.slotsLeft || commission.slots}</Typography>
              </Grid>
            </Grid>

            {/* Tags */}
            {commission.includes && commission.includes.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>Tags</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {commission.includes.map((tag, idx) => (
                    <Chip key={idx} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Artist Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: '#F8FAFC', borderRadius: '16px', mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={artist.profilePicture} sx={{ width: 56, height: 56 }}>
                  {artist.artistName?.charAt(0)}
                </Avatar>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" fontWeight={700}>{artist.artistName}</Typography>
                    <VerifiedIcon sx={{ color: '#4A9FBF', fontSize: 16 }} />
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Verified Artist</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Rating value={artist.rating} size="small" readOnly />
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>({artist.totalReviews} reviews)</Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                onClick={handleOpenRequest}
                sx={{ bgcolor: '#4A9FBF', borderRadius: '40px', py: 1.5, textTransform: 'none', fontWeight: 700 }}
              >
                Request Commission
              </Button>
              <Button
                variant="outlined"
                startIcon={<ChatIcon />}
                onClick={() => setOpenChat(true)}
                sx={{ borderRadius: '40px', px: 3, textTransform: 'none' }}
              >
                Chat
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* ==================== REQUEST COMMISSION MODAL ==================== */}
      <Dialog open={openRequest} onClose={() => !submitting && setOpenRequest(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#4A9FBF', color: 'white' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={700}>Commission Request</Typography>
            <IconButton onClick={() => setOpenRequest(false)} sx={{ color: 'white' }} disabled={submitting}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {requestStep === 1 && (
            <Box>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#1A6B8A', mb: 1 }}>
                  Requesting as @{currentUser?.username || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Once you submit your request, the artist will review it and send you a proposal.
                </Typography>
              </Box>

              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: '#1A6B8A' }}>
                Your Contact Details
              </Typography>

              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={requestData.email}
                onChange={(e) => setRequestData({...requestData, email: e.target.value})}
                margin="normal"
                helperText="Email is NOT shared with anyone. Only used for request updates."
              />

              <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 2, mb: 1, color: '#64748B' }}>
                Social Media (Optional)
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth label="Twitter" placeholder="username" value={requestData.twitter} onChange={(e) => setRequestData({...requestData, twitter: e.target.value})} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Instagram" placeholder="username" value={requestData.instagram} onChange={(e) => setRequestData({...requestData, instagram: e.target.value})} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Twitch" placeholder="username" value={requestData.twitch} onChange={(e) => setRequestData({...requestData, twitch: e.target.value})} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="YouTube" placeholder="username" value={requestData.youtube} onChange={(e) => setRequestData({...requestData, youtube: e.target.value})} />
                </Grid>
              </Grid>

              <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 3, mb: 2, color: '#1A6B8A' }}>
                How will you be using this commission?
              </Typography>

              <TextField
                select
                fullWidth
                label="Usage Type *"
                value={requestData.usage}
                onChange={(e) => setRequestData({...requestData, usage: e.target.value})}
                margin="normal"
              >
                <MenuItem value="personal">Personal Use Only</MenuItem>
                <MenuItem value="commercial">Commercial Use (Streaming/Social Media)</MenuItem>
                <MenuItem value="merch">Commercial Merchandising</MenuItem>
              </TextField>

              <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 3, mb: 2, color: '#1A6B8A' }}>
                References and Files
              </Typography>

              <TextField
                fullWidth
                label="Character reference sheets, mood boards, sample poses"
                multiline
                rows={3}
                value={requestData.references}
                onChange={(e) => setRequestData({...requestData, references: e.target.value})}
                margin="normal"
                placeholder="Describe your character, provide references, or share any specific requirements..."
              />

              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} sx={{ borderRadius: '40px', textTransform: 'none' }}>
                  Upload File
                  <input type="file" hidden multiple onChange={handleFileUpload} />
                </Button>
                {uploadedFiles.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {uploadedFiles.map((file) => (
                      <Chip key={file.id} label={file.name} onDelete={() => removeFile(file.id)} sx={{ m: 0.5 }} />
                    ))}
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <TextField size="small" fullWidth placeholder="Add link (Google Drive, Dropbox, etc.)" value={newLink} onChange={(e) => setNewLink(e.target.value)} />
                <Button variant="outlined" onClick={addLink} startIcon={<AddLinkIcon />}>Add</Button>
              </Box>

              {uploadedLinks.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {uploadedLinks.map((link) => (
                    <Chip key={link.id} label={link.url} onDelete={() => removeLink(link.id)} sx={{ m: 0.5, maxWidth: '100%' }} />
                  ))}
                </Box>
              )}

              <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 3, mb: 2, color: '#1A6B8A' }}>
                May I publicly stream / share the work with credit?
              </Typography>

              <TextField select fullWidth value={requestData.canStream} onChange={(e) => setRequestData({...requestData, canStream: e.target.value})} margin="normal">
                <MenuItem value="yes">Yes, with credit</MenuItem>
                <MenuItem value="no">No, private only</MenuItem>
                <MenuItem value="ask">Ask me first</MenuItem>
              </TextField>

              <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 3, mb: 2, color: '#1A6B8A' }}>
                Do you have a deadline for this project?
              </Typography>

              <TextField fullWidth type="date" value={requestData.deadline} onChange={(e) => setRequestData({...requestData, deadline: e.target.value})} margin="normal" InputLabelProps={{ shrink: true }} />

              <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 3, mb: 2, color: '#1A6B8A' }}>
                How would you like to proceed with the payment?
              </Typography>

              <TextField select fullWidth value={requestData.paymentMethod} onChange={(e) => setRequestData({...requestData, paymentMethod: e.target.value})} margin="normal">
                <MenuItem value="full">Pay in full</MenuItem>
                <MenuItem value="half">50% upfront, 50% on completion</MenuItem>
              </TextField>

              <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 3, mb: 2, color: '#1A6B8A' }}>
                Extra Info
              </Typography>

              <TextField fullWidth multiline rows={3} placeholder="Pose, traits, multiple characters, add-ons, etc." value={requestData.extraInfo} onChange={(e) => setRequestData({...requestData, extraInfo: e.target.value})} />

              <Box sx={{ mt: 4, p: 2, bgcolor: '#F8FAFC', borderRadius: '16px' }}>
                <Typography variant="body2" color="text.secondary">Base price (from service)</Typography>
                <Typography variant="h4" fontWeight={800} sx={{ color: '#1A6B8A' }}>
                  Rp {commission.priceFrom.toLocaleString('id-ID')}
                </Typography>
                <Typography variant="caption" color="text.secondary">Note that this is an auto-generated estimate. The artist may quote a different price after review.</Typography>
              </Box>

              <FormControlLabel
                control={<Checkbox checked={requestData.agreeTerms} onChange={(e) => setRequestData({...requestData, agreeTerms: e.target.checked})} />}
                label="I agree to the Terms of Service and Privacy Policy"
                sx={{ mt: 3 }}
              />
            </Box>
          )}

          {requestStep === 2 && (
            <Box textAlign="center" py={4}>
              <CircularProgress sx={{ color: '#4A9FBF', mb: 2 }} />
              <Typography>Submitting your request...</Typography>
            </Box>
          )}

          {requestStep === 3 && (
            <Box textAlign="center" py={4}>
              <Box sx={{ fontSize: 64, mb: 2 }}>✅</Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: '#10B981', mb: 2 }}>Request Submitted!</Typography>
              <Typography variant="body2" color="text.secondary">Your commission request has been sent to {artist.artistName}. They will review it and get back to you soon.</Typography>
            </Box>
          )}
        </DialogContent>

        {requestStep === 1 && (
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenRequest(false)} variant="outlined" color="error">Cancel</Button>
            <Button onClick={handleSubmitRequest} variant="contained" disabled={!requestData.email || !requestData.agreeTerms} sx={{ bgcolor: '#4A9FBF' }}>Submit Request</Button>
          </DialogActions>
        )}
      </Dialog>

      {/* ==================== CHAT MODAL - MENGGUNAKAN REAL TIME CHAT ==================== */}
      <Dialog open={openChat} onClose={() => setOpenChat(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#4A9FBF', color: 'white', py: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={700}>Chat with {artist.artistName}</Typography>
            <IconButton onClick={() => setOpenChat(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <RealTimeChatBox
            artistId={artist.id}
            artistName={artist.artistName}
            currentUser={currentUser}
            commissionId={commission.id}
          />
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: '12px' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default ArtistDetail;