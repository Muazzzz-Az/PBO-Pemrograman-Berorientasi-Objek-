import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// ==========================================
// 1. ABSTRACTION & POLYMORPHISM COMPONENT
// BaseInput menyembunyikan detail tag <input> HTML bawaan (Abstraction).
// Tipenya berubah secara fleksibel mengikuti props 'type' (Polymorphism).
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
// RegisterForm membungkus seluruh state formData, errors,
// dan fungsi logika API secara aman di dalam satu scope komponen.
// ==========================================
function RegisterForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const response = await fetch('http://localhost:8080/api/auth/register/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                navigate('/login');
            } else {
                const errorData = await response.json();
                setErrors(errorData);
            }
        } catch (error) {
            console.error('Registration error:', error);
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
                maxWidth: '500px',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 12px 40px rgba(74, 159, 191, 0.08)',
                border: '1px solid rgba(74, 159, 191, 0.15)',
                textAlign: 'center',
                boxSizing: 'border-box'
            }}>
                <form onSubmit={handleSubmit}>
                    <h2 style={{ color: '#1A6B8A', margin: '0 0 6px 0', fontWeight: 800, fontSize: '1.8rem' }}>
                        Buat Akun Baru
                    </h2>
                    <p style={{ color: '#5D6D7E', fontSize: '0.95rem', margin: '0 0 32px 0' }}>
                        Silakan isi data untuk mendaftar sebagai Pengguna
                    </p>

                    {Object.keys(errors).length > 0 && (
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
                            {Object.values(errors).map((error, index) => (
                                <p key={index} style={{ margin: '2px 0' }}>{error}</p>
                            ))}
                        </div>
                    )}

                    {/* 3. IMPLEMENTASI INHERITANCE */}
                    {/* Setiap komponen di bawah ini mewarisi (inherit) style & base element dari BaseInput */}
                    <BaseInput
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Contoh: user123"
                    />

                    <BaseInput
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Contoh: user@email.com"
                    />

                    <BaseInput
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Masukkan password minimal 6 karakter"
                    />

                    <BaseInput
                        label="Nama Lengkap"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Masukkan nama sesuai identitas"
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
                        Daftar Akun
                    </button>

                    <p style={{ marginTop: '24px', fontSize: '0.9rem', color: '#5D6D7E', marginBottom: '8px' }}>
                        Sudah memiliki akun?{' '}
                        <Link to="/login" style={{ color: '#4A9FBF', fontWeight: 600, textDecoration: 'none' }}>
                            Masuk di sini
                        </Link>
                    </p>

                    {/* PEMBATAS GARIS TIPIS */}
                    <div style={{ margin: '20px 0', borderTop: '1px solid rgba(74, 159, 191, 0.15)' }}></div>

                    {/* TOMBOL MENMENUJU SELEKSI / LOGIN ARTIST */}
                    <p style={{ fontSize: '0.85rem', color: '#7F8C8D', margin: 0 }}>
                        Ingin bergabung sebagai Seniman CreartsI?
                        <br />
                        <Link to="/for-artists" style={{
                            display: 'inline-block',
                            marginTop: '10px',
                            padding: '8px 20px',
                            borderRadius: '30px',
                            color: '#4A9FBF',
                            fontWeight: 700,
                            textDecoration: 'none',
                            border: '1px solid rgba(74, 159, 191, 0.3)',
                            backgroundColor: '#FFFFFF',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#F2F7F9';
                            e.target.style.borderColor = '#4A9FBF';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#FFFFFF';
                            e.target.style.borderColor = 'rgba(74, 159, 191, 0.3)';
                        }}
                        >
                            I'm an artist+
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;