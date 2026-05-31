import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Pilar OOP: ABSTRACTION & POLYMORPHISM — reusable BaseInput component
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

// Pilar OOP: ENCAPSULATION — wraps all artist registration data
function ArtistRegisterForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        socialMedia: ''
    });

    const [portfolios, setPortfolios] = useState(['', '', '', '', '']);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePortfolioChange = (index, value) => {
        const updatedPortfolios = [...portfolios];
        updatedPortfolios[index] = value;
        setPortfolios(updatedPortfolios);
    };

    const addPortfolioField = () => {
        setPortfolios([...portfolios, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        const filledPortfolios = portfolios.filter(url => url.trim() !== '');
        if (filledPortfolios.length < 5) {
            setErrors({ portfolio: 'Please provide at least 5 portfolio links.' });
            return;
        }

        setLoading(true);
        try {
            // Save submission to localStorage for admin review
            const newArtistSubmission = {
                id: Date.now(),
                name: formData.fullName || formData.username,
                username: formData.username,
                portfolio: filledPortfolios[0],
                status: 'pending'
            };
            const currentSubmissions = JSON.parse(localStorage.getItem('artist_submissions')) || [];
            localStorage.setItem('artist_submissions', JSON.stringify([...currentSubmissions, newArtistSubmission]));

            const response = await fetch('http://localhost:8080/api/auth/register/artist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, portfolios: filledPortfolios })
            });

            if (response.ok) {
                setSuccessMessage('Application submitted! Your profile will be reviewed by an admin before you can accept commissions. Please check back later.');
                setFormData({ username: '', email: '', password: '', fullName: '', socialMedia: '' });
                setPortfolios(['', '', '', '', '']);
            } else {
                const text = await response.text();
                const errorData = text ? JSON.parse(text) : {};
                setErrors({ general: errorData.message || 'Registration failed. Please try again.' });
            }
        } catch (error) {
            console.error('Artist registration error:', error);
            setSuccessMessage('Application submitted! Your profile will be reviewed by an admin.');
            setFormData({ username: '', email: '', password: '', fullName: '', socialMedia: '' });
            setPortfolios(['', '', '', '', '']);
        } finally {
            setLoading(false);
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
                        Join as an Artist
                    </h2>
                    <p style={{ color: '#5D6D7E', fontSize: '0.95rem', margin: '0 0 32px 0', lineHeight: 1.4 }}>
                        Fill in your creative profile. Your account will be reviewed and verified by an Admin before you can accept commission orders.
                    </p>

                    {successMessage && (
                        <div style={{ color: '#27AE60', backgroundColor: '#E8F8F5', padding: '16px', borderRadius: '12px', marginBottom: '25px', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left', lineHeight: 1.4 }}>
                            ✅ {successMessage}
                        </div>
                    )}

                    {Object.keys(errors).length > 0 && (
                        <div style={{ color: '#E74C3C', backgroundColor: '#FCE4EC', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 500, textAlign: 'left' }}>
                            {Object.values(errors).map((err, index) => (
                                <p key={index} style={{ margin: '2px 0' }}>⚠️ {err}</p>
                            ))}
                        </div>
                    )}

                    <BaseInput
                        label="Artist Username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="e.g. artisan_crearts"
                    />

                    <BaseInput
                        label="Active Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. artist@email.com"
                    />

                    <BaseInput
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="At least 8 characters"
                    />

                    <BaseInput
                        label="Full Name / Studio Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Your real name or studio name"
                    />

                    <BaseInput
                        label="Main Social Media Link"
                        name="socialMedia"
                        value={formData.socialMedia}
                        onChange={handleInputChange}
                        placeholder="e.g. instagram.com/yourusername"
                    />

                    {/* Portfolio Section */}
                    <div style={{ textAlign: 'left', marginTop: '24px', marginBottom: '20px' }}>
                        <label style={{ color: '#1A6B8A', fontWeight: 700, fontSize: '0.95rem' }}>
                            Portfolio Links (Minimum 5 Required)
                        </label>
                        <p style={{ color: '#7F8C8D', fontSize: '0.8rem', margin: '4px 0 12px 0' }}>
                            Provide links to your original artwork (Google Drive, ArtStation, Behance, etc.)
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
                                    required={index < 5}
                                    placeholder={index < 5 ? `Required Portfolio Link ${index + 1}` : 'Additional Portfolio Link (Optional)'}
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
                            + Add Another Portfolio Link
                        </button>
                    </div>

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
                            marginTop: '15px',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => { if (!loading) e.target.style.backgroundColor = '#1A6B8A'; }}
                        onMouseOut={(e) => { if (!loading) e.target.style.backgroundColor = '#4A9FBF'; }}
                    >
                        {loading ? 'Submitting...' : 'Submit Verification Application'}
                    </button>

                    <p style={{ marginTop: '24px', fontSize: '0.9rem', color: '#5D6D7E', margin: '24px 0 0 0' }}>
                        Want to register as a regular user?{' '}
                        <Link to="/register" style={{ color: '#4A9FBF', fontWeight: 600, textDecoration: 'none' }}>
                            Click here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ArtistRegisterForm;
