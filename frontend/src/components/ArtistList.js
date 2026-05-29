import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    TextField,
    MenuItem,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    InputAdornment,
    Button,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { artistService } from '../api/ArtistService'; 

function ArtistList() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');

    const categories = [
        "Illustrations",
        "2D Avatars",
        "3D Models",
        "Emotes + Badges",
        "Stream Assets",
        "Branding + Graphics",
        "Animation + Videos"
    ];

    useEffect(() => {
        fetchArtists();
    }, [category]);

    const fetchArtists = async () => {
        try {
            setLoading(true);
            let data = category ? await artistService.getByCategory(category) : await artistService.getAll();
            setArtists(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching artists:', error);
            setLoading(false);
        }
    };

    const filteredArtists = artists.filter(artist =>
        (artist.artistName && artist.artistName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (artist.fullName && artist.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography variant="h6" color="text.secondary">Memuat Daftar Seniman Terbaik...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '100px', marginBottom: '60px' }}>
            <Box textAlign="center" mb={5}>
                <Typography variant="h2" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', color: '#1A202C' }}>
                    Telusuri Kreator Berbakat
                </Typography>
                <Typography variant="body1" color="text.secondary" style={{ fontSize: '1.1rem' }}>
                    Temukan seniman lokal idamanmu untuk mewujudkan karya komisi impian
                </Typography>
            </Box>

            {/* SEKSI FILTER PENCARIAN & KATEGORI */}
            <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                <TextField
                    placeholder="Cari nama seniman..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon style={{ color: '#4A9FBF' }} />
                            </InputAdornment>
                        ),
                    }}
                    style={{ backgroundColor: '#FFFFFF', borderRadius: '12px' }}
                />

                <TextField
                    select
                    label="Semua Kategori"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ minWidth: '240px', backgroundColor: '#FFFFFF' }}
                >
                    <MenuItem value=""><em>Semua Kategori</em></MenuItem>
                    {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                </TextField>
            </Box>

            {/* FIX 1: Margin Top Ekstra di sini (mt={5}) menjauhkan grid kartu dari kotak pencarian */}
            <Box mt={5}>
                <Grid container spacing={3}>
                    {filteredArtists.length > 0 ? (
                        filteredArtists.map(artist => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={artist.id}>
                                {/* FIX 2: height: '100%' memastikan semua kartu di baris yang sama punya tinggi yang sama rata */}
                                <Card style={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '16px',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    backgroundColor: '#ffffff'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(74, 159, 191, 0.15)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.03)';
                                }}
                                >
                                    {/* Banner Atas Kartu */}
                                    <Box sx={{ height: '80px', backgroundColor: 'rgba(74, 159, 191, 0.15)', position: 'relative' }} />

                                    <CardContent style={{ 
                                        flexGrow: 1, 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center', 
                                        padding: '0 20px 20px 20px', 
                                        marginTop: '-40px' 
                                    }}>
                                        <Avatar
                                            src={artist.profilePicture}
                                            alt={artist.artistName}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                marginBottom: '12px',
                                                border: '4px solid #FFFFFF',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                                backgroundColor: '#4A9FBF',
                                                fontSize: '1.5rem',
                                                zIndex: 1
                                            }}
                                        >
                                            {artist.artistName ? artist.artistName.charAt(0) : '🎨'}
                                        </Avatar>

                                        <Typography variant="h6" color="text.primary" style={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2, textAlign: 'center' }}>
                                            {artist.artistName || "Tanpa Nama"}
                                        </Typography>

                                        <Chip
                                            label={artist.artCategory || "General"}
                                            size="small"
                                            style={{ marginTop: '8px', marginBottom: '12px', backgroundColor: '#E6F5E5', color: '#2E7D32', fontWeight: 700, fontSize: '0.7rem' }}
                                        />

                                        {/* CSS Line-Clamp agar Bio konsisten 2 baris */}
                                        <Typography variant="body2" color="text.secondary" style={{ 
                                            textAlign: 'center', 
                                            fontSize: '0.85rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            marginBottom: '16px'
                                        }}>
                                            {artist.bio || "Kreator ini belum menuliskan biodata deskripsi profil mereka."}
                                        </Typography>

                                        {/* FIX 3: Box Bawah (Footer Kartu). mt: 'auto' menekan box ini ke bawah. Tombol CTA ditambahkan untuk mengisi kekosongan. */}
                                        <Box mt="auto" width="100%">
                                            <Divider sx={{ mb: 1.5 }} />
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                <Typography variant="caption" color="text.secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                                                    👥 {artist.followersCount || 0} Pengikut
                                                </Typography>
                                                <Typography variant="caption" style={{ color: '#F39C12', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    ⭐ {artist.rating || '5.0'}
                                                </Typography>
                                            </Box>
                                            
                                            {/* Tombol Call-to-Action untuk menghilangkan ruang kosong yang jelek */}
                                            <Button 
                                                component={Link} 
                                                to={`/artists/${artist.id}`}
                                                variant="outlined" 
                                                fullWidth 
                                                size="small" 
                                                sx={{ 
                                                    borderRadius: '8px', 
                                                    textTransform: 'none', 
                                                    fontWeight: 700,
                                                    color: '#4A9FBF',
                                                    borderColor: '#4A9FBF',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(74, 159, 191, 0.1)',
                                                        borderColor: '#4A9FBF'
                                                    }
                                                }}
                                            >
                                                Lihat Portofolio
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Box width="100%" textAlign="center" py={8}>
                            <Typography variant="body1" color="text.secondary">Tidak ada seniman yang cocok dengan pencarian Anda.</Typography>
                        </Box>
                    )}
                </Grid>
            </Box>
        </Container>
    );
}

export default ArtistList;