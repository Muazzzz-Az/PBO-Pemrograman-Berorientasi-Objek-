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
  // Trigger event untuk realtime update antar tab
  window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(data) }));
};

// ==========================================
// CART SERVICE (Save ke Chart)
// ==========================================
export const cartService = {
  getCart: () => getItem(STORAGE_KEYS.CART),

  addToCart: (commission, userId) => {
    const cart = getItem(STORAGE_KEYS.CART);
    const existingItem = cart.find(item => item.commissionId === commission.id && item.userId === userId);

    if (existingItem) {
      existingItem.quantity += 1;
      setItem(STORAGE_KEYS.CART, cart);
      return existingItem;
    } else {
      const newItem = {
        id: Date.now(),
        commissionId: commission.id,
        userId: userId,
        title: commission.title,
        price: commission.priceFrom,
        coverImage: commission.coverImage,
        artistName: commission.artistName,
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
  }
};

// ==========================================
// REVIEW SERVICE (Rating Real-time)
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

    // Update rating di data artist
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

// ==========================================
// ARTIST SERVICE (Data Real Artist)
// ==========================================
export const realArtistService = {
  getAllArtists: () => getItem(STORAGE_KEYS.ARTISTS),

  getArtistById: (id) => {
    const artists = getItem(STORAGE_KEYS.ARTISTS);
    return artists.find(a => a.id === parseInt(id));
  },

  getArtistCommissions: (artistId) => {
    const commissions = getItem(STORAGE_KEYS.COMMISSIONS);
    return commissions.filter(c => c.artistId === artistId);
  },

  getArtistPortfolio: (artistId) => {
    const portfolio = getItem(STORAGE_KEYS.PORTFOLIO);
    return portfolio.filter(p => p.artistId === artistId);
  },

  updateArtist: (id, data) => {
    const artists = getItem(STORAGE_KEYS.ARTISTS);
    const index = artists.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      artists[index] = { ...artists[index], ...data, updatedAt: new Date().toISOString() };
      setItem(STORAGE_KEYS.ARTISTS, artists);
      return artists[index];
    }
    return null;
  }
};

// ==========================================
// CHAT SERVICE (Real-time)
// ==========================================
export const realChatService = {
  getMessages: (roomId) => {
    const chats = getItem(STORAGE_KEYS.CHAT_HISTORY);
    return chats.filter(c => c.roomId === roomId);
  },

  sendMessage: (roomId, senderId, senderName, receiverId, message) => {
    const chats = getItem(STORAGE_KEYS.CHAT_HISTORY);
    const newMessage = {
      id: Date.now(),
      roomId,
      senderId,
      senderName,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    chats.push(newMessage);
    setItem(STORAGE_KEYS.CHAT_HISTORY, chats);
    return newMessage;
  },

  markAsRead: (roomId, userId) => {
    const chats = getItem(STORAGE_KEYS.CHAT_HISTORY);
    const updated = chats.map(c => {
      if (c.roomId === roomId && c.receiverId === userId) {
        return { ...c, isRead: true };
      }
      return c;
    });
    setItem(STORAGE_KEYS.CHAT_HISTORY, updated);
  },

  getUnreadCount: (userId) => {
    const chats = getItem(STORAGE_KEYS.CHAT_HISTORY);
    return chats.filter(c => c.receiverId === userId && !c.isRead).length;
  }
};

// ==========================================
// HOOK untuk Real-time Updates
// ==========================================
import { useState, useEffect } from 'react';

export const useRealTimeData = (key) => {
  const [data, setData] = useState(() => getItem(key));

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setData(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  const updateData = (newData) => {
    setItem(key, newData);
    setData(newData);
  };

  return [data, updateData];
};