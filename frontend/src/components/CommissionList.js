import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, Grid, Chip, Box, Divider } from '@mui/material';

const CommissionList = () => {
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCommissions();
    }, []);

    // Mengambil data komisi dari Backend Spring Boot
    const fetchCommissions = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/commissions');
            if (response.ok) {
                const data = await response.json();
                setCommissions(data);
            }
        } catch (error) {
            console.error('Error fetching commissions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <Typography variant="h6" color="text.secondary">Memuat Riwayat Komisi...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md" style={{ marginTop: '40px', marginBottom: '40px' }}>
            <Typography variant="h3" fontWeight="bold" mb={1} sx={{ color: '#1A6B8A' }}>
                Riwayat Pesanan 🛍️
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
                Daftar semua permintaan komisi seni yang sedang berjalan atau selesai.
            </Typography>

            {commissions.length === 0 ? (
                <Box textAlign="center" py={8} sx={{ backgroundColor: '#F8FBFA', borderRadius: '16px' }}>
                    <Typography variant="h6" color="text.secondary">Anda belum membuat permintaan komisi.</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {commissions.map((comm) => (
                        <Grid item xs={12} key={comm.id}>
                            <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 8px 24px rgba(74, 159, 191, 0.08)' }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6" fontWeight="bold">
                                        {comm.title}
                                    </Typography>
                                    <Chip 
                                        label={comm.status || 'PENDING'} 
                                        color={comm.status === 'ACCEPTED' ? 'success' : 'warning'} 
                                        size="small"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="caption" color="text.secondary">Kategori Seni</Typography>
                                        <Typography variant="body1" fontWeight="600">{comm.category}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="caption" color="text.secondary">Tawaran Harga</Typography>
                                        <Typography variant="body1" fontWeight="700" sx={{ color: '#F39C12' }}>
                                            Rp {comm.price ? comm.price.toLocaleString('id-ID') : '0'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="caption" color="text.secondary">Deskripsi Singkat</Typography>
                                        <Typography variant="body2" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {comm.description || '-'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default CommissionList;