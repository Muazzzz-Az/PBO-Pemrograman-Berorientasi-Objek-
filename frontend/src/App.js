// App.js - Modified Version
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ArtistList from './components/ArtistList';
import ArtistDetail from './components/ArtistDetail';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProfilePage from './components/ProfilePage';
import CommissionList from './components/CommissionList';
import ArtistRegisterForm from './components/ArtistRegisterForm';

// admin package imports
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// =============================================
// KOMPONEN UNTUK PROTECT ROUTE YANG MEMERLUKAN LOGIN
// =============================================
const PrivateRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const pastelOceanTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4A9FBF',
      light: '#A0D2EB',
      dark: '#1A6B8A',
    },
    secondary: {
      main: '#87D37C',
      light: '#E6F5E5',
    },
    background: {
      default: '#F2F7F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C2833',
      secondary: '#5D6D7E',
    }
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Poppins", "Inter", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em', color: '#1A6B8A' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em', color: '#1A6B8A' },
    h3: { fontWeight: 700, color: '#1A6B8A' },
  },
  shape: { borderRadius: 20 },
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
          border: '1px solid rgba(74, 159, 191, 0.12)',
          boxShadow: '0 10px 30px rgba(74, 159, 191, 0.04)',
        },
      },
    },
  },
});

function App() {
  // 1. CEK LOKASI DEVELOPMENT
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // 2. STATE AWAL: Jika di localhost, langsung bypass status login sebagai admin
  const [isAuthenticated, setIsAuthenticated] = useState(isLocalhost ? true : false);
  const [user, setUser] = useState(isLocalhost ? {
    username: 'naiii',
    fullName: 'Nailah Salmah',
    role: 'admin',
    bio: 'Suka coding web backend & suka main game horror hwhw. 🎨✨',
    avatarUrl: '',
    bannerUrl: ''
  } : null);

  // 3. JALUR PRODUKSI: Tetap membaca localStorage jika aplikasi sudah di-deploy/online
  useEffect(() => {
    if (isLocalhost) return; // Lewati pengecekan jika masih di localhost

    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setIsAuthenticated(true);
      try {
        let parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, [isLocalhost]);

  // Fungsi tambahan agar saat user edit profil, local storage ikut ter-update
  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Daftar route yang BOLEH diakses TANPA login (PUBLIC ROUTES)
  const publicRoutes = ['/', '/login', '/register', '/for-artists'];

  return (
    <ThemeProvider theme={pastelOceanTheme}>
      <CssBaseline />
      <Router>
        <Navbar
          isAuthenticated={isAuthenticated}
          user={user}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
        />
        <Routes>
          {/* ============================================= */}
          {/* PUBLIC ROUTES (Bisa diakses tanpa login) */}
          {/* ============================================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/for-artists" element={<ArtistRegisterForm />} />

          {/* ============================================= */}
          {/* PRIVATE ROUTES (WAJIB LOGIN DULU) */}
          {/* ============================================= */}

          {/* Halaman Artist - WAJIB LOGIN */}
          <Route
            path="/artists"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ArtistList />
              </PrivateRoute>
            }
          />

          {/* Halaman Detail Artist - WAJIB LOGIN */}
          <Route
            path="/artists/:id"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ArtistDetail />
              </PrivateRoute>
            }
          />

          {/* Halaman Commission List - WAJIB LOGIN */}
          <Route
            path="/commissions"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <CommissionList />
              </PrivateRoute>
            }
          />

          {/* Halaman Profile - WAJIB LOGIN */}
          <Route
            path="/profile"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ProfilePage user={user} setUser={handleUpdateUser} />
              </PrivateRoute>
            }
          />

          {/* Halaman Admin - WAJIB LOGIN dan role admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ProtectedRoute user={user}>
                  <AdminDashboard />
                </ProtectedRoute>
              </PrivateRoute>
            }
          />

          {/* CATCH-ALL ROUTE: Redirect ke Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;