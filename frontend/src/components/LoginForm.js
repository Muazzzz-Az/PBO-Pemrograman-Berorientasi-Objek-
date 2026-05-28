import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        try {
            // Basic authentication (you can enhance this with JWT)
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setIsAuthenticated(true);
                setUser(data.user);
                navigate('/');
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>

                {error && <div className="error-message">{error}</div>}

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
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">Login</button>

                <p className="register-link">
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </form>
        </div>
    );
}

export default LoginForm;