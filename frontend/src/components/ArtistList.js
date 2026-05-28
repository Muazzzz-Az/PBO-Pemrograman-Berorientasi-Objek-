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
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function ArtistList() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');

    // DAFTAR KATEGORI BARU YANG DISESUAIKAN DENGAN BANNER BERANDA
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
            let url = 'http://localhost:8080/api/artists';
            if (category) {
                // Meng-encode URI agar space seperti '+' atau ' ' aman dikirim lewat URL
                url += `/category/${encodeURIComponent(category)}`;
            }
            const response = await fetch(url);
            const data = await response.json();
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
        <Container maxWidth="lg" style={{ marginTop: '40px', marginBottom: '6px' }}>
            <Box textAlign="center" mb={5}>
                <Typography variant="h2" style={{ fontSize: '2.2rem', marginBottom: '10px' }}>
                    Telusuri Kreator Berbakat
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Temukan seniman lokal idamanmu untuk mewujudkan karya komisi impian
                </Typography>
            </Box>

            {/* SEKSI FILTER PENCARIAN & KATEGORI */}
            <Box display="flex" gap={2} mb={5} flexDirection={{ xs: 'column', sm: 'row' }}>
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

            {/* GRID ARTIST CARD */}
            <Grid container spacing={4}>
                {filteredArtists.length > 0 ? (
                    filteredArtists.map(artist => (
                        <Grid item xs={12} sm={6} md={4} key={artist.id}>
                            <Card component={Link} to={`/artists/${artist.id}`} style={{
                                textDecoration: 'none',
                                display: 'block',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer',
                                height: '100%'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(74, 159, 191, 0.12)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(74, 159, 191, 0.04)';
                            }}
                            >
                                {/* Banner kecil atau background atas card */}
                                <Box sx={{ height: '100px', backgroundColor: '#E6F5E5', position: 'relative' }} />

                                <CardContent style={{ textAlign: 'center', pt: 0, position: 'relative', marginTop: '-45px' }}>
                                    <Avatar
                                        src={artist.profilePicture}
                                        alt={artist.artistName}
                                        style={{
                                            width: '90px',
                                            height: '90px',
                                            margin: '0 auto 12px auto',
                                            border: '4px solid #FFFFFF',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                            backgroundColor: '#4A9FBF',
                                            fontSize: '2rem'
                                        }}
                                    >
                                        {artist.artistName ? artist.artistName.charAt(0) : '🎨'}
                                    </Avatar>

                                    <Typography variant="h5" color="text.primary" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
                                        {artist.artistName || "Tanpa Nama"}
                                    </Typography>

                                    <Chip
                                        label={artist.artCategory || "General"}
                                        color="primary"
                                        size="small"
                                        style={{ marginTop: '8px', marginBottom: '14px', backgroundColor: 'rgba(74, 159, 191, 0.1)', color: '#1A6B8A', fontWeight: 600 }}
                                    />

                                    <Typography variant="body2" color="text.secondary" style={{ minHeight: '40px', lineHeight: 1.4, marginBottom: '16px' }}>
                                        {artist.bio ? `${artist.bio.substring(0, 75)}...` : "Kreator ini belum menuliskan biodata deskripsi profil mereka."}
                                    </Typography>

                                    <Box display="flex" justifyContent="space-around" borderTop="1px solid rgba(74, 159, 191, 0.08)" pt={2} mt={1}>
                                        <Typography variant="caption" color="text.secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                            👥 {artist.followersCount || 0} Pengikut
                                        </Typography>
                                        <Typography variant="caption" style={{ color: '#F39C12', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            ⭐ {artist.rating || '5.0'}
                                        </Typography>
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
        </Container>
    );
}

export default ArtistList;