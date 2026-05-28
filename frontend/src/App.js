import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ArtistList from './components/ArtistList';
import ArtistDetail from './components/ArtistDetail';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const oceanCatTheme = createTheme({
  palette: {
    primary: {
      main: '#1A6B8A',
      light: '#4A9FBF',
      dark: '#0B4A63',
    },
    secondary: {
      main: '#F4A261',
      light: '#FFB347',
      dark: '#E76F51',
    },
    background: {
      default: '#E8F4F8',
      paper: '#FFFFFF',
    },
    cat: {
      cream: '#FFF3E0',
      orange: '#FFA500',
      blue: '#2196F3'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Plus Jakarta Sans", "Roboto", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
  },
  shape: { borderRadius: 20 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(26, 107, 138, 0.1)',
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <ThemeProvider theme={oceanCatTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar isAuthenticated={isAuthenticated} user={user} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artists" element={<ArtistList />} />
          <Route path="/artists/:id" element={<ArtistDetail />} />
          <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;