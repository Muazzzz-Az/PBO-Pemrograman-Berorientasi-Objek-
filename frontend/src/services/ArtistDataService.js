// src/services/ArtistDataService.js
// SEMUA DATA DIAMBIL DARI USER YANG REAL, TIDAK ADA DUMMY
// DIPERBAIKI: selalu return object valid meskipun artistName tidak ditemukan

const getCurrentUser = () => {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
};

const getAllRegisteredUsers = () => {
  const saved = localStorage.getItem('registered_users');
  return saved ? JSON.parse(saved) : [];
};

// Ambil data artist REAL dari user yang login atau registered_users
export const getArtistData = (artistName) => {
  // Default fallback
  const defaultData = {
    id: null,
    name: 'Artist',
    username: 'artist',
    avatar: null,
    bio: '',
    rating: 0,
    totalReviews: 0,
    isVerified: false
  };

  if (!artistName) {
    return defaultData;
  }

  // 1. Cek current user
  const currentUser = getCurrentUser();
  if (currentUser && (currentUser.fullName === artistName || currentUser.username === artistName)) {
    return {
      id: currentUser.id,
      name: currentUser.fullName,
      username: currentUser.username,
      avatar: currentUser.avatarUrl || null,
      bio: currentUser.bio || '',
      rating: currentUser.rating || 0,
      totalReviews: currentUser.totalReviews || 0,
      isVerified: currentUser.isVerified === true
    };
  }

  // 2. Cari di registered_users
  const users = getAllRegisteredUsers();
  const foundUser = users.find(u => u.fullName === artistName || u.username === artistName);
  if (foundUser) {
    return {
      id: foundUser.id,
      name: foundUser.fullName,
      username: foundUser.username,
      avatar: foundUser.avatarUrl || null,
      bio: foundUser.bio || '',
      rating: foundUser.rating || 0,
      totalReviews: foundUser.totalReviews || 0,
      isVerified: foundUser.isVerified === true
    };
  }

  // 3. Tidak ditemukan, return default
  return defaultData;
};

// Ambil rating dari commission yang sudah completed
export const getArtistReviews = (artistId, artistName) => {
  try {
    const requests = JSON.parse(localStorage.getItem('commission_requests') || '[]');
    const completedRequests = requests.filter(req =>
      (req.artistId === artistId || req.artistName === artistName) &&
      req.status === 'completed' &&
      req.rating && req.rating > 0
    );

    if (!completedRequests || completedRequests.length === 0) {
      return { rating: 0, totalReviews: 0 };
    }

    let totalRating = 0;
    for (let i = 0; i < completedRequests.length; i++) {
      totalRating += (completedRequests[i].rating || 0);
    }
    const averageRating = totalRating / completedRequests.length;

    return {
      rating: parseFloat(averageRating.toFixed(1)),
      totalReviews: completedRequests.length
    };
  } catch (error) {
    console.error('Error getArtistReviews:', error);
    return { rating: 0, totalReviews: 0 };
  }
};

// Ambil semua commission dari localStorage
export const getArtistCommissions = () => {
  const saved = localStorage.getItem('creartsi_artist_commissions');
  return saved ? JSON.parse(saved) : [];
};