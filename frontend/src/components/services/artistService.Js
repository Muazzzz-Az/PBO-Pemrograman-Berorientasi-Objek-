// Artist data service dengan localStorage
const STORAGE_KEY = 'kreartsi_artists';
const REVIEWS_KEY = 'kreartsi_reviews';

// Data artist awal
const defaultArtists = [
  {
    id: 1,
    name: 'Raditya Dika',
    category: 'Musik & Komedi',
    rating: 4.9,
    commissions: 234,
    totalReviews: 45,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    bio: 'Komedian, musisi, dan penulis berbakat Indonesia',
    instagram: '@raditya_dika',
    youtube: '@radityadika',
    emoji: '🐱'
  },
  {
    id: 2,
    name: 'Maudy Ayunda',
    category: 'Musik & Aktris',
    rating: 4.8,
    commissions: 189,
    totalReviews: 32,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    bio: 'Penyanyi, aktris, dan aktivis pendidikan',
    instagram: '@maudyayunda',
    youtube: '@maudyayunda',
    emoji: '🐟'
  },
  {
    id: 3,
    name: 'Didik Nini Thowok',
    category: 'Tari Tradisional',
    rating: 4.9,
    commissions: 345,
    totalReviews: 28,
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100',
    bio: 'Maestro tari topeng Indonesia',
    instagram: '@didiknini',
    youtube: '@didikninithowok',
    emoji: '😺'
  },
  {
    id: 4,
    name: 'Nyoman Nuarta',
    category: 'Seni Patung',
    rating: 4.9,
    commissions: 78,
    totalReviews: 15,
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400',
    avatar: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=100',
    bio: 'Pematung terkenal Indonesia',
    instagram: '@nyomannuarta',
    youtube: '@nyomannuarta',
    emoji: '🎨'
  }
];

// Load data dari localStorage
const loadArtists = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultArtists));
  return defaultArtists;
};

// Save data ke localStorage
const saveArtists = (artists) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(artists));
};

// Load reviews
const loadReviews = () => {
  const stored = localStorage.getItem(REVIEWS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

// Save reviews
const saveReviews = (reviews) => {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
};

// Service functions
export const artistService = {
  // Get all artists
  getAll: () => {
    return loadArtists();
  },

  // Get artist by ID
  getById: (id) => {
    const artists = loadArtists();
    return artists.find(a => a.id === parseInt(id));
  },

  // Add new artist
  add: (artistData) => {
    const artists = loadArtists();
    const newArtist = {
      id: Date.now(),
      rating: 0,
      commissions: 0,
      totalReviews: 0,
      ...artistData,
      emoji: artistData.emoji || '🎨'
    };
    artists.push(newArtist);
    saveArtists(artists);
    return newArtist;
  },

  // Update artist
  update: (id, updatedData) => {
    const artists = loadArtists();
    const index = artists.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      artists[index] = { ...artists[index], ...updatedData };
      saveArtists(artists);
      return artists[index];
    }
    return null;
  },

  // Add review and update rating
  addReview: (artistId, rating, reviewText) => {
    const artists = loadArtists();
    const artist = artists.find(a => a.id === parseInt(artistId));
    if (artist) {
      const newTotal = artist.totalReviews + 1;
      const newRating = ((artist.rating * artist.totalReviews) + rating) / newTotal;
      artist.rating = parseFloat(newRating.toFixed(1));
      artist.totalReviews = newTotal;
      artist.commissions += 1;

      // Save review
      const reviews = loadReviews();
      reviews.push({
        id: Date.now(),
        artistId: parseInt(artistId),
        rating,
        review: reviewText,
        date: new Date().toISOString(),
        reviewer: 'Anonymous'
      });
      saveReviews(reviews);
      saveArtists(artists);
      return artist;
    }
    return null;
  },

  // Get reviews for artist
  getReviews: (artistId) => {
    const reviews = loadReviews();
    return reviews.filter(r => r.artistId === parseInt(artistId));
  },

  // Delete artist
  delete: (id) => {
    const artists = loadArtists();
    const filtered = artists.filter(a => a.id !== parseInt(id));
    saveArtists(filtered);
    return filtered;
  },

  // Search artists
  search: (query) => {
    const artists = loadArtists();
    return artists.filter(a =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
    );
  }
};