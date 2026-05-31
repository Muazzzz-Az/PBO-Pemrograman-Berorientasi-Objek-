// App.js - Modified Version (TANPA AUTO LOGIN)
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
import CategoryPage from './components/CategoryPage';
import MessagesPage from './components/MessagesPage';
import CartPage from './components/CartPage';

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
  // ========== HAPUS SEMUA AUTO LOGIN ==========
  // State awal: selalu false (belum login)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Cek localStorage saat pertama kali load (tanpa bypass apapun)
  useEffect(() => {
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
  }, []);

  // Fungsi tambahan agar saat user edit profil, local storage ikut ter-update
  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

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
          <Route path="/category/:categoryId" element={<CategoryPage />} />

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

          //cart
          <Route path="/cart" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <CartPage />
            </PrivateRoute>
          } />

          //chat
          <Route
            path="/messages"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <MessagesPage user={user} />
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