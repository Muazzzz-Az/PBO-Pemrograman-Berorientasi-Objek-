// src/components/RegisterForm.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const BaseInput = ({ label, type = 'text', name, value, onChange, placeholder, required = true, error }) => {
    return (
        <div style={{ marginBottom: '16px', width: '100%' }}>
            <label style={{
                display: 'block',
                color: error ? '#E74C3C' : '#1A6B8A',
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
                    border: `1px solid ${error ? '#E74C3C' : 'rgba(74, 159, 191, 0.25)'}`,
                    outline: 'none',
                    fontSize: '0.95rem',
                    backgroundColor: error ? '#FFF5F5' : '#F2F7F9',
                    color: '#2C3E50',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = error ? '#E74C3C' : '#4A9FBF'}
                onBlur={(e) => e.target.style.borderColor = error ? '#E74C3C' : 'rgba(74, 159, 191, 0.25)'}
            />
            {error && (
                <p style={{ color: '#E74C3C', fontSize: '0.78rem', margin: '4px 0 0 4px', textAlign: 'left' }}>
                    {error}
                </p>
            )}
        </div>
    );
};

function RegisterForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Hapus error field saat user mulai mengetik
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
        }
    };

    // Validasi di frontend sebelum kirim ke backend
    const validateForm = () => {
        const errors = {};
        if (!formData.username.trim()) errors.username = 'Username is required';
        else if (formData.username.length < 3) errors.username = 'Username must be at least 3 characters';

        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';

        if (!formData.password) errors.password = 'Password is required';
        else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';

        if (!formData.fullName.trim()) errors.fullName = 'Full name is required';

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');
        setFieldErrors({});

        // Validasi frontend dulu
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/auth/register/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const text = await response.text();
            const data = text ? JSON.parse(text) : {};

            if (response.ok) {
                // Simpan ke localStorage untuk tracking
                const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
                registeredUsers.push({
                    id: data.id || Date.now(),
                    username: formData.username,
                    email: formData.email,
                    fullName: formData.fullName,
                    role: 'user',
                    isVerified: false,
                    createdAt: new Date().toISOString()
                });
                localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
                navigate('/login');
            } else {
                // Parse error dari backend dengan pesan yang user-friendly
                if (data.message) {
                    // Error dari backend kita (string biasa)
                    setGeneralError(data.message);
                } else if (data.errors) {
                    // Error validasi Spring (array)
                    const errors = {};
                    data.errors.forEach(err => {
                        errors[err.field] = err.defaultMessage;
                    });
                    setFieldErrors(errors);
                } else if (typeof data === 'object') {
                    // Error validasi Spring format lain
                    const friendlyErrors = {};
                    Object.entries(data).forEach(([key, val]) => {
                        if (key === 'password') friendlyErrors.password = 'Password must be at least 8 characters';
                        else if (key === 'email') friendlyErrors.email = 'Invalid email format';
                        else if (key === 'username') friendlyErrors.username = val;
                        else friendlyErrors.general = val;
                    });
                    setFieldErrors(friendlyErrors);
                } else {
                    setGeneralError('Registration failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setGeneralError('Cannot connect to server. Make sure the backend is running.');
        } finally {
            setLoading(false);
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
                        Create Account
                    </h2>
                    <p style={{ color: '#5D6D7E', fontSize: '0.95rem', margin: '0 0 32px 0' }}>
                        Please fill in your details to register
                    </p>

                    {/* General error */}
                    {generalError && (
                        <div style={{
                            color: '#E74C3C',
                            backgroundColor: '#FCE4EC',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            textAlign: 'left',
                            borderLeft: '4px solid #E74C3C'
                        }}>
                            ⚠️ {generalError}
                        </div>
                    )}

                    <BaseInput
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="At least 3 characters"
                        error={fieldErrors.username}
                    />

                    <BaseInput
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        error={fieldErrors.email}
                    />

                    <BaseInput
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 8 characters"
                        error={fieldErrors.password}
                    />

                    <BaseInput
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        error={fieldErrors.fullName}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            backgroundColor: loading ? '#94A3B8' : '#4A9FBF',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '10px',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => { if (!loading) e.target.style.backgroundColor = '#1A6B8A'; }}
                        onMouseOut={(e) => { if (!loading) e.target.style.backgroundColor = '#4A9FBF'; }}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>

                    <p style={{ marginTop: '24px', fontSize: '0.9rem', color: '#5D6D7E', marginBottom: '8px' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#4A9FBF', fontWeight: 600, textDecoration: 'none' }}>
                            Login here
                        </Link>
                    </p>

                    <div style={{ margin: '20px 0', borderTop: '1px solid rgba(74, 159, 191, 0.15)' }}></div>

                    <p style={{ fontSize: '0.85rem', color: '#7F8C8D', margin: 0 }}>
                        Want to join as an Artist on CreartsI?
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
                            backgroundColor: '#FFFFFF'
                        }}>
                            I'm an artist+
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;
