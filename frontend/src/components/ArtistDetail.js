import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box, Container, Grid, Card, CardContent, Typography, Avatar, Chip, Button, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem // <-- Ini tambahan baris ini
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LanguageIcon from '@mui/icons-material/Language';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// IMPORT BARU: Ambil komponen ChatBox real-time
import ChatBox from './ChatBox';

function ArtistDetail() {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    // === TAMBAHAN LOGIKA KOMISI ===
    const [openModal, setOpenModal] = useState(false);
    const [commissionData, setCommissionData] = useState({
        title: '',
        category: '',
        price: '',
        description: '',
        imageUrl: '' // Opsional
    });

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleCommissionSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/commissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: commissionData.title,
                    category: commissionData.category,
                    price: parseFloat(commissionData.price),
                    description: commissionData.description,
                    imageUrl: commissionData.imageUrl
                })
            });

            if (response.ok) {
                alert("Pemesanan Komisi Berhasil Dikirim ke Seniman!");
                setOpenModal(false);
                setCommissionData({ title: '', category: '', price: '', description: '', imageUrl: '' }); // Reset Form
            } else {
                alert("Gagal mengirim komisi. Cek koneksi backend.");
            }
        } catch (error) {
            console.error('Error submitting commission:', error);
        }
    };

    // MENGAMBIL USER DATA: Mengambil status login dari localStorage untuk keperluan otentikasi chat
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchArtistDetails();
        fetchArtworks();
    }, [id]);

    const fetchArtistDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/artists/${id}`);
            const data = await response.json();
            setArtist(data);
        } catch (error) {
            console.error('Error fetching artist details:', error);
        }
    };

    const fetchArtworks = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/artworks/artist/${id}`);
            const data = await response.json();
            setArtworks(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching artworks:', error);
            setLoading(false);
        }
    };

    if (loading || !artist) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography color="text.secondary">Memuat detail profil seniman...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '30px', marginBottom: '50px' }}>
            {/* TOMBOL KEMBALI */}
            <Button
                component={Link}
                to="/artists"
                startIcon={<ArrowBackIcon />}
                style={{ marginBottom: '25px', color: '#1A6B8A', fontWeight: 700 }}
            >
                Kembali ke Daftar
            </Button>

            {/* HEADER PROFIL CARD */}
            <Card style={{ marginBottom: '40px', border: '1px solid rgba(74, 159, 191, 0.15)' }}>
                <Box sx={{ height: '160px', backgroundColor: 'rgba(74, 159, 191, 0.15)' }} />
                <CardContent style={{ padding: '30px', marginTop: '-80px' }}>
                    <Grid container spacing={3} alignItems="flex-end">
                        <Grid item>
                            <Avatar
                                src={artist.profilePicture}
                                alt={artist.artistName}
                                style={{
                                    width: '130px',
                                    height: '130px',
                                    border: '5px solid #FFFFFF',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                    backgroundColor: '#4A9FBF',
                                    fontSize: '3rem'
                                }}
                            >
                                {artist.artistName?.charAt(0) || '🎭'}
                            </Avatar>
                        </Grid>
                        <Grid item xs={12} sm>
                            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                                <Typography variant="h3" style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>
                                    {artist.artistName}
                                </Typography>
                                <Chip
                                    label={artist.artCategory}
                                    style={{ backgroundColor: '#E6F5E5', color: '#1A6B8A', fontWeight: 700 }}
                                />
                            </Box>
                            <Typography variant="body1" color="text.secondary" style={{ marginTop: '4px' }}>
                                {artist.fullName}
                            </Typography>

                            {/* MEDSOS */}
                            <Box display="flex" gap={1} mt={2}>
                                {artist.instagram && (
                                    <IconButton component="a" href={artist.instagram} target="_blank" style={{ color: '#E1306C' }}>
                                        <InstagramIcon />
                                    </IconButton>
                                )}
                                {artist.youtube && (
                                    <IconButton component="a" href={artist.youtube} target="_blank" style={{ color: '#FF0000' }}>
                                        <YouTubeIcon />
                                    </IconButton>
                                )}
                                {artist.portfolio && (
                                    <IconButton component="a" href={artist.portfolio} target="_blank" style={{ color: '#4A9FBF' }}>
                                        <LanguageIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm="auto">
                            <Box display="flex" gap={2}>
                                <Button variant="outlined" color="primary" style={{ borderWidth: '2px' }}>
                                    Ikuti Seniman
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleOpenModal} style={{ color: '#FFFFFF' }}>
                                    Hubungi / Komisi
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* KONTEN UTAMA */}
            <Grid container spacing={4}>
                {/* KOLOM KIRI: TENTANG SENIMAN & CHATBOX PRIVAT */}
                <Grid item xs={12} md={4}>
                    <Card style={{ padding: '24px', marginBottom: '24px' }}>
                        <Typography variant="h5" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
                            Tentang Seniman
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{ lineHeight: 1.6 }}>
                            {artist.bio || "Seniman ini belum menambahkan biodata rincian profil."}
                        </Typography>
                    </Card>

                    {/* INTEGRASI KOTAK CHAT REAL-TIME */}
                    {/* Mengirimkan data id seniman, nama seniman, dan data pembeli yang sedang aktif login */}
                    <Box mt={3}>
                        <ChatBox
                            artistId={id}
                            artistName={artist.artistName}
                            currentUser={currentUser}
                        />
                    </Box>
                </Grid>

                {/* KOLOM KANAN: GRID ETALASE KARYA SENI */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h4" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>
                        Karya Seni Terbaru
                    </Typography>

                    {artworks.length > 0 ? (
                        <Grid container spacing={3}>
                            {artworks.map(artwork => (
                                <Grid item xs={12} sm={6} key={artwork.id}>
                                    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Box style={{ position: 'relative', paddingTop: '70%', overflow: 'hidden', backgroundColor: '#F2F7F9' }}>
                                            <img
                                                src={artwork.imageUrl}
                                                alt={artwork.title}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </Box>
                                        <CardContent style={{ flexGrow: 1, padding: '16px' }}>
                                            <Typography variant="h6" style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>
                                                {artwork.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block" style={{ marginBottom: '12px', minHeight: '32px' }}>
                                                {artwork.description || "Tidak ada deskripsi."}
                                            </Typography>

                                            <Box display="flex" justifyContent="space-between" alignItems="center" pt={1} borderTop="1px solid rgba(74, 159, 191, 0.08)">
                                                <Typography variant="body2" style={{ fontWeight: 700, color: '#4A9FBF' }}>
                                                    Rp {artwork.price ? Number(artwork.price).toLocaleString('id-ID') : '0'}
                                                </Typography>
                                                <Box display="flex" gap={1.5}>
                                                    <Typography variant="caption" color="text.secondary">❤️ {artwork.likesCount || 0}</Typography>
                                                    <Typography variant="caption" color="text.secondary">👁️ {artwork.viewsCount || 0}</Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box p={4} textAlign="center" bgcolor="#FFFFFF" borderRadius="24px" border="1px solid rgba(74, 159, 191, 0.12)">
                            <Typography variant="body2" color="text.secondary">Kreator belum mengunggah contoh pameran karya seni.</Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* MODAL FORMULIR KOMISI */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle style={{ fontWeight: 'bold', color: '#1A6B8A' }}>Formulir Permintaan Komisi</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Isi detail permintaan komisi seni Anda untuk {artist.artistName}.
                    </Typography>
                    <TextField
                        fullWidth label="Judul Permintaan (Misal: Avatar 2D Headshot)" variant="outlined" margin="normal"
                        value={commissionData.title}
                        onChange={(e) => setCommissionData({...commissionData, title: e.target.value})}
                    />
                    <TextField
                        fullWidth select label="Kategori" variant="outlined" margin="normal"
                        value={commissionData.category}
                        onChange={(e) => setCommissionData({...commissionData, category: e.target.value})}
                    >
                        {["Illustrations", "2D Avatars", "3D Models", "Emotes + Badges"].map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth label="Tawaran Harga (Rp)" variant="outlined" margin="normal" type="number"
                        value={commissionData.price}
                        onChange={(e) => setCommissionData({...commissionData, price: e.target.value})}
                    />
                    <TextField
                        fullWidth label="Deskripsi Detail" variant="outlined" margin="normal" multiline rows={4}
                        placeholder="Jelaskan pose, warna, atau referensi secara detail..."
                        value={commissionData.description}
                        onChange={(e) => setCommissionData({...commissionData, description: e.target.value})}
                    />
                </DialogContent>
                <DialogActions style={{ padding: '16px 24px' }}>
                    <Button onClick={handleCloseModal} color="error" variant="outlined">Batal</Button>
                    <Button onClick={handleCommissionSubmit} color="primary" variant="contained" style={{ color: '#FFFFFF' }}>Kirim Permintaan</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ArtistDetail;