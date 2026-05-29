import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// ==========================================
// 1. MOCK DATA
// ==========================================
const mockProducts = [
    { id: 1, category: 'illustrations', title: 'Genshin Impact Custom Splash Art', price: 'IDR 450.000', artist: 'NabArt', rating: '5.0', slots: 3, image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=600&q=80', type: 'Personal Use' },
    { id: 2, category: 'illustrations', title: 'Watercolor Portrait', price: 'IDR 714.612', artist: 'Mollin', rating: '4.9', slots: 4, image: 'https://images.unsplash.com/photo-1579762715111-aa2f073236e8?auto=format&fit=crop&w=600&q=80', type: 'Commercial' },
    { id: 3, category: '2d-avatars', title: 'Wuthering Waves Chibi Model', price: 'IDR 1.200.000', artist: 'RoverStudio', rating: '5.0', slots: 1, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80', type: 'Monetized Content' },
    { id: 4, category: '2d-avatars', title: 'Half-Body VTuber Rig Ready', price: 'IDR 2.500.000', artist: 'Live2D Master', rating: '4.8', slots: 2, image: 'https://images.unsplash.com/photo-1518599904199-0ca897819ddb?auto=format&fit=crop&w=600&q=80', type: 'Commercial' },
    { id: 5, category: 'emotes-badges', title: 'Zetian Honor of Kings Emote Pack', price: 'IDR 150.000', artist: 'MidLanerArt', rating: '5.0', slots: 10, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80', type: 'Personal Use' },
];

// ==========================================
// 2. KOMPONEN MODAL DETAIL (FINAL FIX)
// ==========================================
const ProductModal = ({ product, onClose }) => {
    // Tambahkan useEffect untuk handle scroll body biar ga double scroll
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
            zIndex: 9999, // 👈 Paksa di atas Navbar & Sub-navbar
            padding: '20px',
            backdropFilter: 'blur(4px)'
        }} onClick={onClose}>

            <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '28px',
                width: '100%',
                maxWidth: '1000px',
                maxHeight: '92vh', // 👈 Biar gak nabrak atas bawah browser
                overflowY: 'auto', // 👈 Biar bisa scroll di dalam modal
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap', // Support mobile view juga
                position: 'relative',
                boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                animation: 'modalSlideUp 0.3s ease-out'
            }} onClick={(e) => e.stopPropagation()}>

                {/* Tombol Close Mengambang */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: '15px', left: '15px',
                    background: 'white', border: 'none', borderRadius: '50%',
                    width: '36px', height: '36px', fontSize: '1rem',
                    cursor: 'pointer', color: '#1A6B8A', fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10
                }}>✕</button>

                {/* Bagian Kiri: Gambar (Responsive) */}
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

                {/* Bagian Kanan: Detail */}
                <div style={{
                    flex: '1',
                    padding: '40px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '300px'
                }}>
                    <p style={{ color: '#4A9FBF', fontSize: '0.85rem', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '1px' }}>
                        {product.category.replace('-', ' ').toUpperCase()}
                    </p>
                    <h2 style={{ color: '#1A6B8A', fontSize: '1.7rem', margin: '0 0 5px 0', lineHeight: 1.2 }}>{product.title}</h2>
                    <h3 style={{ color: '#2C3E50', fontSize: '1.5rem', margin: '0 0 25px 0', fontWeight: 800 }}>From {product.price}</h3>

                    {/* Terms & Info */}
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

                    {/* Artist Box */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '15px',
                        padding: '15px', backgroundColor: '#F8FBFC', borderRadius: '18px', border: '1px solid #E0F2F7', marginBottom: '25px'
                    }}>
                        <div style={{ width: '48px', height: '48px', backgroundColor: '#4A9FBF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
                            {product.artist.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, color: '#1A6B8A' }}>{product.artist}</h4>
                            <p style={{ margin: 0, color: '#5D6D7E', fontSize: '0.8rem' }}>@creator_lokal</p>
                        </div>
                        <button style={{ padding: '6px 15px', borderRadius: '20px', border: '1px solid #4A9FBF', backgroundColor: 'white', color: '#4A9FBF', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Follow</button>
                    </div>

                    <div style={{ backgroundColor: '#F2F7F9', padding: '15px', borderRadius: '12px', fontSize: '0.85rem', color: '#5D6D7E', marginBottom: '30px' }}>
                        Thanks for considering me for your commission! Please start a request only if the terms are acceptable.
                    </div>

                    {/* Action Buttons */}
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button style={{
                            padding: '18px', borderRadius: '14px', border: 'none',
                            backgroundColor: '#4A9FBF', color: '#FFFFFF', fontWeight: 700,
                            fontSize: '1rem', cursor: 'pointer'
                        }}>
                            Accept terms to start request
                        </button>
                        <div style={{ color: '#2ECC71', fontSize: '0.9rem', textAlign: 'center', fontWeight: 700 }}>
                            Only {product.slots} slots left!
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animation (Inline Style Tag) */}
            <style>{`
                @keyframes modalSlideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================
function CategoryPage() {
    const { categoryId } = useParams();
    const [selectedProduct, setSelectedProduct] = useState(null);

    const displayCategory = categoryId || 'illustrations';
    const filteredProducts = mockProducts.filter(p => p.category === displayCategory);
    const pageTitle = displayCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div style={{ backgroundColor: '#F9FCFD', minHeight: '100vh', paddingBottom: '50px' }}>

            {/* Header Section */}
            <div style={{ padding: '80px 5% 40px 5%', backgroundColor: '#F2F7F9', borderBottom: '1px solid #E0F2F7' }}>
                <h1 style={{ color: '#1A6B8A', fontSize: '2.8rem', fontWeight: 900, marginBottom: '10px' }}>
                    Custom {pageTitle}
                </h1>
                <p style={{ color: '#5D6D7E', fontSize: '1.1rem', maxWidth: '700px', lineHeight: 1.6 }}>
                    Temukan talenta terbaik dunia untuk mewujudkan proyek {pageTitle.toLowerCase()} kamu.
                </p>

                {/* Sub-tags */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '30px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '5px' }}>
                    {['Character Art', 'Backgrounds', 'Chibi Style', 'Concept Art', 'Anime'].map(tag => (
                        <span key={tag} style={{
                            padding: '10px 20px', borderRadius: '25px', border: '1px solid rgba(74, 159, 191, 0.2)',
                            color: '#1A6B8A', fontSize: '0.9rem', cursor: 'pointer', backgroundColor: 'white', fontWeight: 600
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Grid Produk */}
            <div style={{
                padding: '40px 5%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '30px'
            }}>
                {filteredProducts.map(product => (
                    <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        style={{
                            backgroundColor: '#FFFFFF', borderRadius: '24px', overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(74, 159, 191, 0.05)', cursor: 'pointer',
                            border: '1px solid rgba(74, 159, 191, 0.08)', transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(74, 159, 191, 0.12)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(74, 159, 191, 0.05)'; }}
                    >
                        <div style={{ height: '230px', overflow: 'hidden' }}>
                            <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '22px' }}>
                            <h3 style={{ fontSize: '1.1rem', margin: '0 0 15px 0', color: '#1A6B8A', fontWeight: 700, height: '2.4em', overflow: 'hidden' }}>{product.title}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '28px', height: '28px', backgroundColor: '#4A9FBF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>{product.artist.charAt(0)}</div>
                                    <span style={{ fontSize: '0.85rem', color: '#5D6D7E', fontWeight: 600 }}>{product.artist}</span>
                                </div>
                                <span style={{ fontSize: '0.9rem', color: '#F39C12', fontWeight: 800 }}>★ {product.rating}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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