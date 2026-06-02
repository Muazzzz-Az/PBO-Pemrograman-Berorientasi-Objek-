// src/services/RealTimeDataService.js

// ==========================================
// KEYS LOCALSTORAGE
// ==========================================
const STORAGE_KEYS = {
  COMMISSIONS: 'creartsi_artist_commissions',
  PORTFOLIO: 'creartsi_artist_portfolio',
  ARTISTS: 'kreartsi_artists',
  CART: 'creartsi_cart',
  REVIEWS: 'creartsi_reviews',
  CHAT_HISTORY: 'creartsi_chat_history'
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================
const getItem = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setItem = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(data) }));
};

// ==========================================
// CART SERVICE
// ==========================================
export const cartService = {
  getCart: () => getItem(STORAGE_KEYS.CART),

  addToCart: (commission, userId) => {
    if (!commission || !userId) {
      console.error("Gagal masuk keranjang: Data komisi atau User ID kosong");
      return null;
    }

    const cart = getItem(STORAGE_KEYS.CART);
    const targetCommissionId = commission.id || commission.commissionId || Date.now();
    const existingItem = cart.find(item => item.commissionId === targetCommissionId && item.userId === userId);

    if (existingItem) {
      existingItem.quantity += 1;
      setItem(STORAGE_KEYS.CART, cart);
      return existingItem;
    } else {
      const normalizedPrice = commission.price || commission.priceFrom || 0;

      // JANGAN simpan base64 image di cart — terlalu besar, bikin localStorage penuh
      // Simpan URL saja atau string pendek
      let coverImage = commission.coverImage || '';
      if (coverImage.startsWith('data:image')) {
        // Kalau base64, ganti dengan placeholder
        coverImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200';
      }

      const newItem = {
        id: Date.now(),
        commissionId: targetCommissionId,
        artistId: commission.artistId,
        userId: userId,
        title: commission.title || 'Untitled Commission',
        price: Number(normalizedPrice),
        coverImage: coverImage,
        artistName: commission.artistName || 'Unknown Artist',
        quantity: 1,
        addedAt: new Date().toISOString()
      };

      cart.push(newItem);
      setItem(STORAGE_KEYS.CART, cart);
      return newItem;
    }
  },

  removeFromCart: (itemId, userId) => {
    let cart = getItem(STORAGE_KEYS.CART);
    cart = cart.filter(item => item.id !== itemId || item.userId !== userId);
    setItem(STORAGE_KEYS.CART, cart);
    return cart;
  },

  updateQuantity: (itemId, userId, quantity) => {
    const cart = getItem(STORAGE_KEYS.CART);
    const item = cart.find(i => i.id === itemId && i.userId === userId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      setItem(STORAGE_KEYS.CART, cart);
    }
    return cart;
  },

  clearCart: (userId) => {
    let cart = getItem(STORAGE_KEYS.CART);
    cart = cart.filter(item => item.userId !== userId);
    setItem(STORAGE_KEYS.CART, cart);
    return cart;
  },

  getCartTotal: (userId) => {
    const cart = getItem(STORAGE_KEYS.CART);
    const userCart = cart.filter(item => item.userId === userId);
    return userCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getCartCount: (userId) => {
    const cart = getItem(STORAGE_KEYS.CART);
    return cart.filter(item => item.userId === userId).length;
  }
};

// ==========================================
// REVIEW SERVICE
// ==========================================
export const reviewService = {
  getReviews: (artistId) => {
    const reviews = getItem(STORAGE_KEYS.REVIEWS);
    return reviews.filter(r => r.artistId === artistId);
  },

  getArtistRating: (artistId) => {
    const reviews = getItem(STORAGE_KEYS.REVIEWS);
    const artistReviews = reviews.filter(r => r.artistId === artistId);
    if (artistReviews.length === 0) return { rating: 0, count: 0 };
    const total = artistReviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      rating: total / artistReviews.length,
      count: artistReviews.length
    };
  },

  addReview: (artistId, userId, userName, rating, comment) => {
    const reviews = getItem(STORAGE_KEYS.REVIEWS);
    const newReview = {
      id: Date.now(),
      artistId,
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    reviews.push(newReview);
    setItem(STORAGE_KEYS.REVIEWS, reviews);

    const artists = getItem(STORAGE_KEYS.ARTISTS);
    const artistIndex = artists.findIndex(a => a.id === artistId);
    if (artistIndex !== -1) {
      const artistReviews = reviews.filter(r => r.artistId === artistId);
      const totalRating = artistReviews.reduce((sum, r) => sum + r.rating, 0);
      artists[artistIndex].rating = totalRating / artistReviews.length;
      artists[artistIndex].totalReviews = artistReviews.length;
      setItem(STORAGE_KEYS.ARTISTS, artists);
    }
    return newReview;
  }
};