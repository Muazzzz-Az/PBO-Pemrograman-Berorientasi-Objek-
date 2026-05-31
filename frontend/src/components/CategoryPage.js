// src/components/CategoryPage.js - Real Data Version
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ==========================================
// GET REAL DATA FROM LOCALSTORAGE
// ==========================================
const getArtistCommissions = () => {
  const saved = localStorage.getItem('creartsi_artist_commissions');
  return saved ? JSON.parse(saved) : [];
};

const getArtists = () => {
  const saved = localStorage.getItem('kreartsi_artists');
  return saved ? JSON.parse(saved) : [];
};

const getAllUsers = () => {
  const saved = localStorage.getItem('registered_users');
  return saved ? JSON.parse(saved) : [];
};

// Get user data by name
const getUserData = (userName) => {
  if (!userName) {
    return {
      name: 'Artist',
      username: 'artist',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 0,
      totalReviews: 0
    };
  }

  try {
    // Check in registered_users
    const users = getAllUsers();
    const foundUser = users.find(u => u.fullName === userName || u.username === userName);

    if (foundUser) {
      return {
        name: foundUser.fullName || userName,
        username: foundUser.username || userName.toLowerCase().replace(/ /g, ''),
        avatar: foundUser.avatarUrl || 'https://i.pravatar.cc/150?img=1',
        rating: foundUser.rating || 0,
        totalReviews: foundUser.totalReviews || 0
      };
    }

    // Check in artists list
    const artists = getArtists();
    const foundArtist = artists.find(a => a.name === userName || a.username === userName);

    if (foundArtist) {
      return {
        name: foundArtist.name || userName,
        username: foundArtist.username || userName.toLowerCase().replace(/ /g, ''),
        avatar: foundArtist.avatar || foundArtist.profilePicture || 'https://i.pravatar.cc/150?img=1',
        rating: foundArtist.rating || 0,
        totalReviews: foundArtist.totalReviews || 0
      };
    }

    return {
      name: userName,
      username: userName.toLowerCase().replace(/ /g, ''),
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 0,
      totalReviews: 0
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    return {
      name: userName,
      username: userName.toLowerCase().replace(/ /g, ''),
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 0,
      totalReviews: 0
    };
  }
};

// Get reviews for an artist
const getArtistReviews = (artistId, artistName) => {
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
    console.error('Error getting reviews:', error);
    return { rating: 0, totalReviews: 0 };
  }
};

// Category mapping
const categoryMapping = {
  'illustrations': 'Illustrations',
  '2d-avatars': '2D Avatars',
  '3d-models': '3D Models',
  'emotes-badges': 'Emotes + Badges',
  'stream-assets': 'Stream Assets',
  'branding-graphics': 'Branding + Graphics',
  'animation-videos': 'Animation + Videos'
};

// ==========================================
// PRODUCT MODAL COMPONENT
// ==========================================
const ProductModal = ({ product, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!product) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 9999,
      padding: '20px',
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '28px',
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '92vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        position: 'relative',
        boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
      }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '15px', left: '15px',
          background: 'white', border: 'none', borderRadius: '50%',
          width: '36px', height: '36px', fontSize: '1rem',
          cursor: 'pointer', color: '#1A6B8A', fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10
        }}>✕</button>

        <div style={{
          flex: '1.2',
          minWidth: '300px',
          backgroundColor: '#F0F4F7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img src={product.image} alt={product.title} style={{
            width: '100%', height: '100%', objectFit: 'cover', minHeight: '450px'
          }} />
        </div>

        <div style={{
          flex: '1',
          padding: '40px 30px',
          display: 'flex',
          flexDirection: 'column',
          minWidth: '300px'
        }}>
          <p style={{ color: '#4A9FBF', fontSize: '0.85rem', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '1px' }}>
            {product.category?.toUpperCase()}
          </p>
          <h2 style={{ color: '#1A6B8A', fontSize: '1.7rem', margin: '0 0 5px 0', lineHeight: 1.2 }}>{product.title}</h2>
          <h3 style={{ color: '#2C3E50', fontSize: '1.5rem', margin: '0 0 25px 0', fontWeight: 800 }}>From {product.price}</h3>

          <div style={{ marginBottom: '25px', color: '#5D6D7E' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ color: '#2ECC71', fontWeight: 'bold' }}>✓</span> <span>Personal Use</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ color: product.type !== 'Personal Use' ? '#2ECC71' : '#E74C3C', fontWeight: 'bold' }}>
                {product.type !== 'Personal Use' ? '✓' : '✕'}
              </span>
              <span style={{ textDecoration: product.type === 'Personal Use' ? 'line-through' : 'none', opacity: product.type === 'Personal Use' ? 0.6 : 1 }}>
                Monetized Content
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '15px',
            padding: '15px', backgroundColor: '#F8FBFC', borderRadius: '18px', border: '1px solid #E0F2F7', marginBottom: '25px'
          }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#4A9FBF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
              {product.artist?.charAt(0) || 'A'}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, color: '#1A6B8A' }}>{product.artist}</h4>
              <p style={{ margin: 0, color: '#5D6D7E', fontSize: '0.8rem' }}>@{product.artistUsername}</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#F2F7F9', padding: '15px', borderRadius: '12px', fontSize: '0.85rem', color: '#5D6D7E', marginBottom: '30px' }}>
            {product.description || 'Thanks for considering me for your commission! Please start a request only if the terms are acceptable.'}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button style={{
              padding: '18px', borderRadius: '14px', border: 'none',
              backgroundColor: '#4A9FBF', color: '#FFFFFF', fontWeight: 700,
              fontSize: '1rem', cursor: 'pointer'
            }}>
              Accept terms to start request
            </button>
            <div style={{ color: '#2ECC71', fontSize: '0.9rem', textAlign: 'center', fontWeight: 700 }}>
              {product.slotsLeft > 0 ? `${product.slotsLeft} slots left!` : 'Commission closed'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN CATEGORY PAGE COMPONENT
// ==========================================
function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const displayCategory = categoryId || 'illustrations';
  const pageTitle = categoryMapping[displayCategory] || displayCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Load real data from localStorage
  useEffect(() => {
    const loadProducts = () => {
      setLoading(true);

      try {
        const allCommissions = getArtistCommissions();
        const categoryName = categoryMapping[displayCategory];

        // Filter commissions by category and only open ones
        let filteredCommissions = allCommissions.filter(comm =>
          comm.category === categoryName && comm.isOpen === true
        );

        // Map to product format
        const productItems = filteredCommissions.map(comm => {
          // Get artist data
          const artistData = getUserData(comm.artistName);
          const reviewData = getArtistReviews(comm.artistId, comm.artistName);

          return {
            id: comm.id,
            category: comm.category,
            title: comm.title || 'Commission Package',
            price: `Rp ${(comm.priceFrom || 0).toLocaleString('id-ID')}`,
            priceRaw: comm.priceFrom || 0,
            artist: artistData.name,
            artistUsername: artistData.username,
            artistAvatar: artistData.avatar,
            rating: reviewData.totalReviews > 0 ? reviewData.rating : artistData.rating,
            totalReviews: reviewData.totalReviews > 0 ? reviewData.totalReviews : artistData.totalReviews,
            slotsLeft: comm.slotsLeft || comm.slots || 5,
            image: comm.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
            description: comm.description || 'Professional custom artwork tailored to your needs.',
            turnaround: comm.turnaround || '7-14 days',
            revisions: comm.revisions || 2,
            type: 'Commercial', // Default, can be customized
            includes: comm.includes || []
          };
        });

        setProducts(productItems);
      } catch (error) {
        console.error('Error loading category products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadProducts();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [displayCategory]);

  // Sub-category tags (dynamic from actual commissions)
  const getDynamicTags = () => {
    const allTags = new Set();
    products.forEach(product => {
      if (product.includes && product.includes.length > 0) {
        product.includes.forEach(tag => allTags.add(tag));
      }
    });
    // Add category as tag
    allTags.add(pageTitle);
    return Array.from(allTags).slice(0, 6); // Max 6 tags
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#F9FCFD',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #4A9FBF',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748B' }}>Loading commissions...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F9FCFD', minHeight: '100vh', paddingBottom: '50px' }}>
      {/* Header Section */}
      <div style={{ padding: '80px 5% 40px 5%', backgroundColor: '#F2F7F9', borderBottom: '1px solid #E0F2F7' }}>
        <h1 style={{ color: '#1A6B8A', fontSize: '2.8rem', fontWeight: 900, marginBottom: '10px' }}>
          Custom {pageTitle}
        </h1>
        <p style={{ color: '#5D6D7E', fontSize: '1.1rem', maxWidth: '700px', lineHeight: 1.6 }}>
          Find the perfect {pageTitle.toLowerCase()} artist for your creative project
        </p>

        {/* Dynamic Sub-tags from real data */}
        {products.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '30px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '5px' }}>
            {getDynamicTags().map(tag => (
              <span key={tag} style={{
                padding: '10px 20px', borderRadius: '25px', border: '1px solid rgba(74, 159, 191, 0.2)',
                color: '#1A6B8A', fontSize: '0.9rem', cursor: 'pointer', backgroundColor: 'white', fontWeight: 600
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div style={{ padding: '20px 5% 0 5%' }}>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          <strong>{products.length}</strong> commissions found
        </p>
      </div>

      {/* Grid Produk - Dari Data Real */}
      {products.length === 0 ? (
        <div style={{
          padding: '80px 5%',
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          margin: '40px 5%',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
          <h3 style={{ color: '#1A6B8A', marginBottom: '8px' }}>No commissions yet</h3>
          <p style={{ color: '#64748B' }}>
            No {pageTitle} commissions available at the moment.
            <br />
            Check back later or explore other categories!
          </p>
        </div>
      ) : (
        <div style={{
          padding: '40px 5%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              style={{
                backgroundColor: '#FFFFFF', borderRadius: '24px', overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(74, 159, 191, 0.05)', cursor: 'pointer',
                border: '1px solid rgba(74, 159, 191, 0.08)', transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(74, 159, 191, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(74, 159, 191, 0.05)';
              }}
            >
              <div style={{ height: '230px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600';
                  }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: product.slotsLeft > 0 ? '#10B981' : '#EF4444',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 700
                }}>
                  {product.slotsLeft > 0 ? `${product.slotsLeft} slots` : 'Closed'}
                </span>
              </div>
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#4A9FBF', fontWeight: 700, backgroundColor: '#E0F2FE', padding: '2px 10px', borderRadius: '20px' }}>
                    {product.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', color: '#1A6B8A', fontWeight: 700, height: '2.4em', overflow: 'hidden' }}>
                  {product.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '15px', height: '2.4em', overflow: 'hidden' }}>
                  {product.description?.substring(0, 80)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#4A9FBF',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {product.artist?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>{product.artist}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>@{product.artistUsername}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1A6B8A' }}>{product.price}</div>
                    {product.rating > 0 && (
                      <div style={{ fontSize: '0.7rem', color: '#F59E0B' }}>★ {product.rating}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Layer */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default CategoryPage;