// src/components/MyCommissionRequests.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, Button,
  Stack, Divider, Avatar, Tabs, Tab, Paper, CircularProgress,
  Tooltip, IconButton, Stepper, Step, StepLabel
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import BuildIcon from '@mui/icons-material/Build';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import InboxIcon from '@mui/icons-material/Inbox';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────
const STATUS = {
  pending: {
    label: 'Waiting Approval', color: '#F59E0B', bg: '#FFFBEB',
    border: '#FDE68A', text: '#92400E',
    icon: <PendingIcon sx={{ fontSize: 14 }} />,
    desc: 'Your request has been sent. Waiting for the artist to respond.',
  },
  accepted: {
    label: 'Accepted', color: '#3B82F6', bg: '#EFF6FF',
    border: '#BFDBFE', text: '#1E40AF',
    icon: <CheckCircleIcon sx={{ fontSize: 14 }} />,
    desc: 'Artist accepted! You can now chat to discuss details.',
  },
  ongoing: {
    label: 'In Progress', color: '#8B5CF6', bg: '#F5F3FF',
    border: '#DDD6FE', text: '#5B21B6',
    icon: <BuildIcon sx={{ fontSize: 14 }} />,
    desc: 'The artist is currently working on your commission.',
  },
  completed: {
    label: 'Completed', color: '#10B981', bg: '#ECFDF5',
    border: '#A7F3D0', text: '#065F46',
    icon: <DoneAllIcon sx={{ fontSize: 14 }} />,
    desc: 'Your commission is done! 🎉',
  },
  rejected: {
    label: 'Declined', color: '#EF4444', bg: '#FEF2F2',
    border: '#FECACA', text: '#991B1B', icon: null,
    desc: 'The artist was unable to take this commission.',
  },
};

// ─────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.pending;
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.5,
      px: 1.5, py: 0.5, borderRadius: '20px',
      bgcolor: cfg.bg, border: `1px solid ${cfg.border}`,
      color: cfg.text, fontWeight: 700, fontSize: '0.75rem',
      letterSpacing: '0.3px', whiteSpace: 'nowrap',
    }}>
      {cfg.icon}{cfg.label}
    </Box>
  );
};

// ─────────────────────────────────────────
// PROGRESS STEPS
// ─────────────────────────────────────────
const STEPS = ['Sent', 'Accepted', 'In Progress', 'Done'];
const STEP_KEYS = ['pending', 'accepted', 'ongoing', 'completed'];

const ProgressSteps = ({ status }) => {
  const currentIdx = status === 'rejected' ? -1 : STEP_KEYS.indexOf(status);

  if (status === 'rejected') {
    return (
      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 2.5, fontWeight: 700 }}>
        ✕ Request Declined by Artist
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 3, mb: 1 }}>
      <Stepper activeStep={currentIdx} alternativeLabel sx={{
        '& .MuiStepConnector-line': {
          borderTopWidth: '3px',
          borderRadius: '2px',
        },
        '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
          borderColor: '#4A9FBF',
        },
        '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
          borderColor: '#10B981',
        },
        '& .MuiStepConnector-root .MuiStepConnector-line': {
          borderColor: '#E2E8F0',
        }
      }}>
        {STEPS.map((label, index) => {
          const isDone = index <= currentIdx;
          const isActive = index === currentIdx;
          const isPastActive = index < currentIdx;
          
          return (
            <Step key={label} completed={isPastActive}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    color: isDone ? (isActive ? '#4A9FBF' : '#10B981') : '#E2E8F0',
                    '&.Mui-active': { color: '#4A9FBF' },
                    '&.Mui-completed': { color: '#10B981' },
                    '& .MuiStepIcon-text': {
                      fill: '#fff',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                    }
                  }
                }}
              >
                <Typography variant="caption" sx={{
                  fontWeight: isActive ? 800 : (isDone ? 600 : 500),
                  color: isActive ? '#1A6B8A' : (isDone ? '#10B981' : '#94A3B8'),
                  fontSize: '0.75rem',
                  display: 'block',
                  textAlign: 'center',
                  mt: 0.5
                }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

// ─────────────────────────────────────────
// REQUEST CARD
// ─────────────────────────────────────────
const RequestCard = ({ request, onChat, onViewArtist }) => {
  const canChat = request.status === 'accepted' || request.status === 'ongoing';
  const isPending = request.status === 'pending';
  const cfg = STATUS[request.status] || STATUS.pending;
  const price = (request.commissionPrice || 0).toLocaleString('id-ID');
  const dateStr = new Date(request.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Card sx={{
      borderRadius: '20px', overflow: 'hidden', mb: 2.5,
      border: `1.5px solid ${cfg.border}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.2s, transform 0.2s',
      '&:hover': { boxShadow: '0 6px 24px rgba(74,159,191,0.12)', transform: 'translateY(-2px)' },
    }}>
      {/* colour stripe */}
      <Box sx={{ height: 4, bgcolor: cfg.color }} />

      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box flex={1} minWidth={0}>
            <Typography variant="caption" sx={{
              color: cfg.color, fontWeight: 700, fontSize: '0.7rem',
              textTransform: 'uppercase', letterSpacing: '0.6px',
            }}>
              🎨 Commission Request
            </Typography>
            <Typography variant="h6" fontWeight={800} sx={{
              color: '#1E293B', lineHeight: 1.2, mt: 0.3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {request.commissionTitle || request.productTitle || 'Commission Request'}
            </Typography>
          </Box>
          <Box textAlign="right" flexShrink={0}>
            <StatusBadge status={request.status} />
            <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#1A6B8A', mt: 0.8, fontSize: '1rem' }}>
              Rp {price}
            </Typography>
          </Box>
        </Stack>

        {/* Artist row */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{
          mt: 2, p: 1.5, bgcolor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0',
        }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#1A6B8A', fontSize: '0.9rem', fontWeight: 700 }}>
            {request.artistName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box flex={1}>
            <Typography variant="body2" fontWeight={700} color="#1E293B">{request.artistName}</Typography>
            <Typography variant="caption" color="#64748B">Artist · Requested {dateStr}</Typography>
          </Box>
        </Stack>

        {/* Status message */}
        <Box sx={{ mt: 2, p: 1.5, bgcolor: cfg.bg, borderRadius: '10px', borderLeft: `3px solid ${cfg.color}` }}>
          <Typography variant="body2" sx={{ color: cfg.text, fontWeight: 600 }}>{cfg.desc}</Typography>
        </Box>

        {/* Progress */}
        <ProgressSteps status={request.status} />

        <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

        {/* Actions */}
        <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" gap={1}>
          <Button size="small" variant="outlined" startIcon={<AccountCircleOutlinedIcon />}
            onClick={() => onViewArtist(request)}
            sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600, borderColor: '#CBD5E1', color: '#64748B', '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC' } }}>
            Artist Profile
          </Button>

          {canChat && (
            <Button size="small" variant="contained" startIcon={<ChatBubbleOutlinedIcon sx={{ fontSize: 15 }} />}
              onClick={() => onChat(request)}
              sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 700, bgcolor: '#4A9FBF', '&:hover': { bgcolor: '#1A6B8A' }, boxShadow: 'none' }}>
              Chat with Artist
            </Button>
          )}

          {isPending && (
            <Button size="small" variant="outlined" disabled startIcon={<LockOutlinedIcon sx={{ fontSize: 15 }} />}
              sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600 }}>
              Chat Locked
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

// ─────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────
const StatCard = ({ count, label, color, bg, icon }) => (
  <Card sx={{ borderRadius: '20px', bgcolor: bg, border: `1.5px solid ${color}22`, boxShadow: 'none', overflow: 'hidden' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color, lineHeight: 1 }}>{count}</Typography>
          <Typography variant="caption" sx={{ color, opacity: 0.75, fontWeight: 700, letterSpacing: '0.4px' }}>
            {label.toUpperCase()}
          </Typography>
        </Box>
        <Box sx={{ width: 44, height: 44, borderRadius: '14px', bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

// ─────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────
function MyCommissionRequests() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = useCallback(() => {
    if (!currentUser) return;
    const commReqs = JSON.parse(localStorage.getItem('commission_requests') || '[]');
    const myRequests = commReqs.filter(r => String(r.buyerId) === String(currentUser.id));
    myRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setRequests(myRequests);
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return; }
    loadRequests();
    const interval = setInterval(loadRequests, 3000);
    const handleChange = () => setTimeout(loadRequests, 100);
    window.addEventListener('storage', handleChange);
    window.addEventListener('commissionRequestUpdated', handleChange);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleChange);
      window.removeEventListener('commissionRequestUpdated', handleChange);
    };
  }, [loadRequests, navigate]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadRequests();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleChat = (request) => {
    navigate(`/messages?userId=${request.artistId}&requestId=${request.id}`);
  };

  const handleViewArtist = (request) => {
    const dest = request.artistUsername || request.artistName;
    if (dest) navigate(`/artist/${dest}`);
  };

  const getFiltered = () => {
    switch (activeTab) {
      case 1: return requests.filter(r => r.status === 'pending');
      case 2: return requests.filter(r => r.status === 'accepted' || r.status === 'ongoing');
      case 3: return requests.filter(r => r.status === 'completed');
      default: return requests;
    }
  };

  const pendingCount   = requests.filter(r => r.status === 'pending').length;
  const activeCount    = requests.filter(r => r.status === 'accepted' || r.status === 'ongoing').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;
  const filtered = getFiltered();

  if (!currentUser) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: 5 }}>
      <Container maxWidth="md">

        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ width: 44, height: 44, borderRadius: '14px', bgcolor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <InboxIcon sx={{ color: '#10B981', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={900} sx={{ color: '#1E293B', lineHeight: 1.1 }}>
                My Commission Requests
              </Typography>
              <Typography variant="caption" color="#64748B">Track the status of your commission orders</Typography>
            </Box>
          </Stack>

          <Tooltip title="Refresh" arrow>
            <IconButton onClick={handleRefresh} sx={{
              bgcolor: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '14px',
              width: 42, height: 42, color: '#4A9FBF', transition: 'all 0.2s',
              '&:hover': { bgcolor: '#EFF6FF', borderColor: '#4A9FBF' },
            }}>
              <RefreshIcon sx={{
                fontSize: 20,
                animation: refreshing ? 'spin 0.6s linear' : 'none',
                '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
              }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3.5 }}>
          <Grid item xs={4}><StatCard count={pendingCount} label="Pending" color="#F59E0B" bg="#FFFBEB" icon={<PendingIcon />} /></Grid>
          <Grid item xs={4}><StatCard count={activeCount} label="Active" color="#8B5CF6" bg="#F5F3FF" icon={<BuildIcon />} /></Grid>
          <Grid item xs={4}><StatCard count={completedCount} label="Done" color="#10B981" bg="#ECFDF5" icon={<DoneAllIcon />} /></Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ borderRadius: '16px', overflow: 'hidden', mb: 3, border: '1.5px solid #E2E8F0', boxShadow: 'none' }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="fullWidth" sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', color: '#64748B', py: 1.8 },
            '& .Mui-selected': { color: '#1A6B8A', fontWeight: 800 },
            '& .MuiTabs-indicator': { bgcolor: '#4A9FBF', height: 3, borderRadius: '3px 3px 0 0' },
          }}>
            <Tab label={`All  (${requests.length})`} />
            <Tab label={`Pending  (${pendingCount})`} />
            <Tab label={`Active  (${activeCount})`} />
            <Tab label={`Done  (${completedCount})`} />
          </Tabs>
        </Paper>

        {/* List */}
        {filtered.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8, borderRadius: '20px', border: '1.5px dashed #CBD5E1', boxShadow: 'none', bgcolor: '#fff' }}>
            {activeTab === 0 ? (
              <>
                <SearchIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 1.5 }} />
                <Typography variant="h6" fontWeight={700} color="#94A3B8">No commission requests yet</Typography>
                <Typography variant="body2" color="#CBD5E1" sx={{ mt: 0.5, mb: 3 }}>Browse artists and request a commission to get started</Typography>
                <Button variant="contained" onClick={() => navigate('/artists')} sx={{ bgcolor: '#4A9FBF', borderRadius: '20px', textTransform: 'none', fontWeight: 700, px: 3, boxShadow: 'none', '&:hover': { bgcolor: '#1A6B8A' } }}>
                  Browse Artists
                </Button>
              </>
            ) : (
              <>
                <InboxIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 1.5 }} />
                <Typography variant="h6" fontWeight={700} color="#94A3B8">
                  {activeTab === 1 ? 'No pending requests' : activeTab === 2 ? 'No active commissions' : 'No completed commissions'}
                </Typography>
              </>
            )}
          </Card>
        ) : (
          filtered.map(req => (
            <RequestCard key={req.id} request={req} onChat={handleChat} onViewArtist={handleViewArtist} />
          ))
        )}
      </Container>
    </Box>
  );
}

export default MyCommissionRequests;
