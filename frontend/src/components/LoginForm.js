import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// ==========================================
// 1. ABSTRACTION & POLYMORPHISM COMPONENT
// BaseInput menyembunyikan detail tag <input> HTML bawaan (Abstraction).
// Karakteristiknya berubah dinamis mengikuti kebutuhan tipe data (Polymorphism).
// ==========================================
const BaseInput = ({ label, type = 'text', name, value, onChange, placeholder, required = true }) => {
    return (
        <div style={{ marginBottom: '18px', width: '100%' }}>
            <label style={{
                display: 'block',
                color: '#1A6B8A',
                fontWeight: 600,
                fontSize: '0.85rem',
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
                    fontSize: '0.9rem',
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
// LoginForm mengemas state keamanan autentikasi, status error,
// dan penanganan form submit dalam satu kesatuan aman.
// ==========================================
function LoginForm({ setIsAuthenticated, setUser }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Proteksi pengecekan status verifikasi seniman sebelum diberikan akses masuk
                if (data.user.role === 'Artist' && !data.user.isVerified) {
                    setError('Akun Seniman Anda sedang dalam proses verifikasi oleh Admin. Mohon tunggu.');
                    return;
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setIsAuthenticated(true);
                setUser(data.user);
                navigate('/');
            } else {
                setError(data.message || 'Username atau password salah.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Koneksi gagal. Silakan coba lagi nanti.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '85vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            backgroundColor: '#F2F7F9',
            fontFamily: '"Plus Jakarta Sans", sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '45px 40px',
                boxShadow: '0 12px 40px rgba(74, 159, 191, 0.08)',
                border: '1px solid rgba(74, 159, 191, 0.15)',
                textAlign: 'center',
                boxSizing: 'border-box'
            }}>
                <form onSubmit={handleSubmit}>
                    <h2 style={{ color: '#1A6B8A', margin: '0 0 6px 0', fontWeight: 800, fontSize: '1.8rem' }}>
                        Selamat Datang Kembali
                    </h2>
                    <p style={{ color: '#5D6D7E', fontSize: '0.95rem', margin: '0 0 32px 0' }}>
                        Silakan masuk ke akun CreartsI Anda
                    </p>

                    {error && (
                        <div style={{
                            color: '#E74C3C',
                            backgroundColor: '#FCE4EC',
                            padding: '12px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            textAlign: 'left'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* 3. IMPLEMENTASI INHERITANCE */}
                    {/* Menggunakan kembali komponen BaseInput sehingga mewarisi properti dasar */}
                    <BaseInput
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Masukkan username"
                    />

                    <BaseInput
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Masukkan password"
                    />

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
                        marginTop: '10px',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1A6B8A'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#4A9FBF'}
                    >
                        Masuk
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#5D6D7E', margin: '24px 0 0 0' }}>
                        Belum punya akun?{' '}
                        <Link to="/register" style={{ color: '#4A9FBF', fontWeight: 600, textDecoration: 'none' }}>
                            Daftar di sini
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;