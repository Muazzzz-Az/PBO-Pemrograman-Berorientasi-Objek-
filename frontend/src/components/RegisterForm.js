// frontend/src/components/RegisterForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        artistName: '',
        artCategory: '',
        bio: '',
        isArtist: false
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
        try {
            const endpoint = formData.isArtist ? '/api/auth/register/artist' : '/api/auth/register/user';
            const response = await fetch(`http://localhost:8080${endpoint}`, {
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
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Daftar Sebagai {formData.isArtist ? 'Seniman' : 'Pengguna'}</h2>

                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="isArtist"
                            checked={formData.isArtist}
                            onChange={(e) => setFormData({...formData, isArtist: e.target.checked})}
                        />
                        Daftar sebagai Seniman
                    </label>
                </div>

                {formData.isArtist && (
                    <>
                        <div className="form-group">
                            <label>Nama Seni</label>
                            <input
                                type="text"
                                name="artistName"
                                value={formData.artistName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Kategori Seni</label>
                            <select name="artCategory" value={formData.artCategory} onChange={handleChange} required>
                                <option value="">Pilih Kategori</option>
                                <option value="Music">Musik</option>
                                <option value="Painting">Lukis</option>
                                <option value="Dance">Tari</option>
                                <option value="Theater">Teater</option>
                                <option value="Photography">Fotografi</option>
                                <option value="Literature">Sastra</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Biografi</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                            ></textarea>
                        </div>
                    </>
                )}

                <button type="submit" className="submit-btn">Daftar</button>

                {Object.keys(errors).length > 0 && (
                    <div className="errors">
                        {Object.values(errors).map((error, index) => (
                            <p key={index} className="error">{error}</p>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
}

export default RegisterForm;