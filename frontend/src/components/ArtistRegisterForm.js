import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// ==========================================
// 1. ABSTRACTION & POLYMORPHISM COMPONENT
// Memakai kembali cetakan BaseInput yang sama dengan Login/Register
// ==========================================
const BaseInput = ({ label, type = 'text', name, value, onChange, placeholder, required = true }) => {
    return (
        <div style={{ marginBottom: '16px', width: '100%' }}>
            <label style={{
                display: 'block',
                color: '#1A6B8A',
                fontWeight: 600,
                fontSize: '0.9rem',
                marginBottom: '6px',
                textAlign: 'left'
            }}>
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(74, 159, 191, 0.25)',
                    outline: 'none',
                    fontSize: '0.95rem',
                    backgroundColor: '#F2F7F9',
                    color: '#2C3E50',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4A9FBF'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(74, 159, 191, 0.25)'}
            />
        </div>
    );
};

// ==========================================
// 2. ENCAPSULATION COMPONENT
// Membungkus seluruh data pengajuan seleksi seniman
// ==========================================
function ArtistRegisterForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        socialMedia: ''
    });

    // State khusus untuk menampung minimal 5 tautan karya portofolio
    const [portfolios, setPortfolios] = useState(['', '', '', '', '']);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Mengubah isi specifik index portofolio
    const handlePortfolioChange = (index, value) => {
        const updatedPortfolios = [...portfolios];
        updatedPortfolios[index] = value;
        setPortfolios(updatedPortfolios);
    };

    // Menambah baris input portofolio baru jika seniman ingin memasukkan lebih dari 5
    const addPortfolioField = () => {
        setPortfolios([...portfolios, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        // Validasi pilar enkapsulasi: Memastikan minimal 5 field terisi dan tidak kosong
        const filledPortfolios = portfolios.filter(url => url.trim() !== '');
        if (filledPortfolios.length < 5) {
            setErrors({ portfolio: 'Wajib memasukkan minimal 5 tautan portofolio karya terbaik Anda!' });
            return;
        }

        try {
            // === TAMBAHAN LOGIKA FRONTEND: Kirim data ke simulasi tabel Admin ===
            const newArtistSubmission = {
                id: Date.now(),
                name: formData.fullName || formData.username,
                username: formData.username,
                portfolio: filledPortfolios[0], // Mengambil salah satu link portfolio untuk ditampilkan di tabel admin
                status: 'pending'
            };
            const currentSubmissions = JSON.parse(localStorage.getItem('artist_submissions')) || [];
            localStorage.setItem('artist_submissions', JSON.stringify([...currentSubmissions, newArtistSubmission]));
            // ===================================================================

            // Menembak ke endpoint khusus pendaftaran artist (menunggu seleksi admin)
            const response = await fetch('http://localhost:8080/api/auth/register/artist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    portfolios: filledPortfolios // Mengirim array portofolio
                })
            });

            if (response.ok) {
                setSuccessMessage('Pendaftaran berhasil! Berkas Anda telah dikirim ke Admin untuk proses verifikasi. Mohon periksa akun Anda secara berkala.');
                // Reset form setelah sukses
                setFormData({ username: '', email: '', password: '', fullName: '', socialMedia: '' });
                setPortfolios(['', '', '', '', '']);
            } else {
                const errorData = await response.json();
                setErrors(errorData);
            }
        } catch (error) {
            console.error('Artist registration error:', error);
            // Tetap set sukses jika ini untuk demo localstorage (jika backend mati)
            setSuccessMessage('Pendaftaran berhasil! Berkas Anda telah dikirim ke Admin untuk proses verifikasi.');
            setFormData({ username: '', email: '', password: '', fullName: '', socialMedia: '' });
            setPortfolios(['', '', '', '', '']);
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '50px 20px',
            backgroundColor: '#F2F7F9',
            fontFamily: '"Plus Jakarta Sans", sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 12px 40px rgba(74, 159, 191, 0.08)',
                border: '1px solid rgba(74, 159, 191, 0.15)',
                boxSizing: 'border-box'
            }}>
                <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        backgroundColor: '#E8F4F8',
                        color: '#1A6B8A',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        marginBottom: '12px'
                    }}>
                        👨‍🎨 ARTIST REGISTRATION POOL
                    </div>

                    <h2 style={{ color: '#1A6B8A', margin: '0 0 6px 0', fontWeight: 800, fontSize: '1.8rem' }}>
                        Bergabung sebagai Seniman
                    </h2>
                    <p style={{ color: '#5D6D7E', fontSize: '0.95rem', margin: '0 0 32px 0', lineHeight: 1.4 }}>
                        Isi berkas kreasi Anda. Akun Anda akan ditinjau dan diverifikasi oleh Admin sebelum dapat menerima pesanan komisi.
                    </p>

                    {/* Notifikasi Sukses Seleksi */}
                    {successMessage && (
                        <div style={{ color: '#27AE60', backgroundColor: '#E8F8F5', padding: '16px', borderRadius: '12px', marginBottom: '25px', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left', lineHeight: 1.4 }}>
                            {successMessage}
                        </div>
                    )}

                    {/* Notifikasi Error */}
                    {Object.keys(errors).length > 0 && (
                        <div style={{ color: '#E74C3C', backgroundColor: '#FCE4EC', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 500, textAlign: 'left' }}>
                            {Object.values(errors).map((err, index) => (
                                <p key={index} style={{ margin: '2px 0' }}>{err}</p>
                            ))}
                        </div>
                    )}

                    {/* INTERFACE DATA PRIBADI (INHERITANCE) */}
                    <BaseInput
                        label="Username Seniman"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Contoh: artisan_crearts"
                    />

                    <BaseInput
                        label="Email Aktif"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Contoh: artist@email.com"
                    />

                    <BaseInput
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Buat password keamanan akun"
                    />

                    <BaseInput
                        label="Nama Lengkap / Studio"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama asli sesuai kartu identitas"
                    />

                    <BaseInput
                        label="Tautan Sosial Media Utama"
                        name="socialMedia"
                        value={formData.socialMedia}
                        onChange={handleInputChange}
                        placeholder="Contoh: instagram.com/username Anda"
                    />

                    {/* SEKSI UNTUK MINIMAL 5 PORTOFOLIO */}
                    <div style={{ textAlign: 'left', marginTop: '24px', marginBottom: '20px' }}>
                        <label style={{ color: '#1A6B8A', fontWeight: 700, fontSize: '0.95rem' }}>
                            Portofolio Karya Terbaik (Minimal 5 Tautan)
                        </label>
                        <p style={{ color: '#7F8C8D', fontSize: '0.8rem', margin: '4px 0 12px 0' }}>
                            Masukkan tautan link gambar/drive/artstation hasil karya asli milik Anda sendiri.
                        </p>

                        {portfolios.map((url, index) => (
                            <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: '#4A9FBF', fontWeight: 700, fontSize: '0.9rem', minWidth: '25px' }}>
                                    #{index + 1}
                                </span>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handlePortfolioChange(index, e.target.value)}
                                    required={index < 5} // 5 field pertama wajib diisi
                                    placeholder={index < 5 ? `Link Portofolio Wajib ${index + 1}` : 'Link Portofolio Tambahan (Opsional)'}
                                    style={{
                                        flex: 1,
                                        padding: '10px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(74, 159, 191, 0.25)',
                                        outline: 'none',
                                        fontSize: '0.9rem',
                                        backgroundColor: '#F2F7F9'
                                    }}
                                />
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addPortfolioField}
                            style={{
                                marginTop: '8px',
                                backgroundColor: 'transparent',
                                border: '1px dashed #4A9FBF',
                                color: '#4A9FBF',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            + Tambah Link Karya Tambahan
                        </button>
                    </div>

                    <button type="submit" style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: '#4A9FBF',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        marginTop: '15px',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1A6B8A'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#4A9FBF'}
                    >
                        Ajukan Berkas Verifikasi
                    </button>

                    <p style={{ marginTop: '24px', fontSize: '0.9rem', color: '#5D6D7E', margin: '24px 0 0 0' }}>
                        Kembali ke halaman pendaftaran umum?{' '}
                        <Link to="/register" style={{ color: '#4A9FBF', fontWeight: 600, textDecoration: 'none' }}>
                            Klik di sini
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ArtistRegisterForm;