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

// PENGUBAHAN: Menjadi Tema Pastel Biru Muda - Mint - Krem (Unik & Bebas Plagiat)
const pastelOceanTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4A9FBF',     // Biru pastel utama
      light: '#A0D2EB',    // Biru langit muda
      dark: '#1A6B8A',     // Biru samudera tua untuk teks kontras
    },
    secondary: {
      main: '#87D37C',     // Hijau mint lembut pengganti lime neon VGen
      light: '#E6F5E5',    // Soft mint background
    },
    background: {
      default: '#F2F7F9',   // Background halaman biru pastel yang sangat bersih
      paper: '#FFFFFF',     // Background card putih bersih
    },
    text: {
      primary: '#1C2833',   // Abu-abu gelap (bukan hitam pekat) agar nyaman dibaca
      secondary: '#5D6D7E', // Abu-abu sekunder untuk sub-judul
    }
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Poppins", "Inter", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em', color: '#1A6B8A' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em', color: '#1A6B8A' },
    h3: { fontWeight: 700, color: '#1A6B8A' },
  },
  shape: { borderRadius: 20 }, // Sudut melengkung halus khas pastel
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '40px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 22px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(74, 159, 191, 0.12)', // Border biru transparan super tipis
          boxShadow: '0 10px 30px rgba(74, 159, 191, 0.04)',
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
    <ThemeProvider theme={pastelOceanTheme}>
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