import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// ==========================================
// 1. MOCK DATA (Data Dummy Biar Halaman Ramai)
// ==========================================
const mockProducts = [
    { id: 1, category: 'illustrations', title: 'Genshin Impact Custom Splash Art', price: 'IDR 450.000', artist: 'NabArt', rating: '5.0', slots: 3, image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=600&q=80', type: 'Personal Use' },
    { id: 2, category: 'illustrations', title: 'Watercolor Portrait', price: 'IDR 714.612', artist: 'Mollin', rating: '4.9', slots: 4, image: 'https://images.unsplash.com/photo-1579762715111-aa2f073236e8?auto=format&fit=crop&w=600&q=80', type: 'Commercial' },
    { id: 3, category: '2d-avatars', title: 'Wuthering Waves Chibi Model', price: 'IDR 1.200.000', artist: 'RoverStudio', rating: '5.0', slots: 1, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80', type: 'Monetized Content' },
    { id: 4, category: '2d-avatars', title: 'Half-Body VTuber Rig Ready', price: 'IDR 2.500.000', artist: 'Live2D Master', rating: '4.8', slots: 2, image: 'https://images.unsplash.com/photo-1518599904199-0ca897819ddb?auto=format&fit=crop&w=600&q=80', type: 'Commercial' },
    { id: 5, category: 'emotes-badges', title: 'Zetian Honor of Kings Emote Pack', price: 'IDR 150.000', artist: 'MidLanerArt', rating: '5.0', slots: 10, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80', type: 'Personal Use' },
    { id: 6, category: '3d-models', title: 'Zenless Zone Zero Character Rig', price: 'IDR 3.000.000', artist: 'Proxy3D', rating: '4.7', slots: 1, image: 'https://images.unsplash.com/photo-1633398814264-9331ab00a061?auto=format&fit=crop&w=600&q=80', type: 'Commercial' },
    { id: 7, category: 'stream-assets', title: 'Cozy Room Stream Overlay', price: 'IDR 350.000', artist: 'AestheticStream', rating: '5.0', slots: 5, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80', type: 'Monetized Content' },
    { id: 8, category: 'branding-graphics', title: 'Esports Logo Design', price: 'IDR 800.000', artist: 'VectorNinja', rating: '4.9', slots: 2, image: 'https://images.unsplash.com/photo-1626785773984-ce8b7bb05912?auto=format&fit=crop&w=600&q=80', type: 'Commercial' },
];

// ==========================================
// 2. KOMPONEN MODAL DETAIL (Pop-up mirip gambar 3)
// ==========================================
const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(26, 107, 138, 0.6)', // Overlay biru transparan
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '900px',
                maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'row',
                position: 'relative', boxShadow: '0 24px 50px rgba(0,0,0,0.15)'
            }}>
                {/* Tombol Close */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: '20px', left: '20px', background: '#F2F7F9',
                    border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                    fontSize: '1.2rem', cursor: 'pointer', color: '#1A6B8A', fontWeight: 'bold'
                }}>
                    ✕
                </button>

                {/* Bagian Kiri: Gambar */}
                <div style={{ flex: '1', padding: '20px', backgroundColor: '#F9FCFD', borderRight: '1px solid #E0F2F7' }}>
                    <img src={product.image} alt={product.title} style={{
                        width: '100%', borderRadius: '16px', objectFit: 'cover', height: '100%', minHeight: '400px'
                    }} />
                </div>

                {/* Bagian Kanan: Detail & ToS */}
                <div style={{ flex: '1', padding: '40px 30px', display: 'flex', flexDirection: 'column' }}>
                    <p style={{ color: '#5D6D7E', fontSize: '0.9rem', margin: '0 0 8px 0' }}>{product.category.replace('-', ' ').toUpperCase()}</p>
                    <h2 style={{ color: '#1A6B8A', fontSize: '1.8rem', margin: '0 0 10px 0' }}>{product.title}</h2>
                    <h3 style={{ color: '#4A9FBF', fontSize: '1.4rem', margin: '0 0 24px 0', fontWeight: 700 }}>From {product.price}</h3>

                    {/* License Checklist */}
                    <div style={{ marginBottom: '24px', fontSize: '0.95rem', color: '#2C3E50', lineHeight: '1.8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#2ECC71' }}>✓</span> Personal
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: product.type !== 'Personal Use' ? '#2ECC71' : '#E74C3C' }}>
                                {product.type !== 'Personal Use' ? '✓' : '✕'}
                            </span> Monetized content
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: product.type === 'Commercial' ? '#2ECC71' : '#E74C3C' }}>
                                {product.type === 'Commercial' ? '✓' : '✕'}
                            </span> Commercial merchandising
                        </div>
                    </div>

                    {/* Artist Profile Box */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '16px', backgroundColor: '#F2F7F9', borderRadius: '16px', marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '45px', height: '45px', backgroundColor: '#4A9FBF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                {product.artist.charAt(0)}
                            </div>
                            <div>
                                <h4 style={{ margin: 0, color: '#1A6B8A', fontSize: '1rem' }}>{product.artist}</h4>
                                <p style={{ margin: 0, color: '#5D6D7E', fontSize: '0.8rem' }}>@{product.artist.toLowerCase()}</p>
                            </div>
                        </div>
                        <button style={{
                            padding: '8px 16px', borderRadius: '20px', border: '1px solid #4A9FBF',
                            backgroundColor: 'transparent', color: '#4A9FBF', fontWeight: 600, cursor: 'pointer'
                        }}>Follow</button>
                    </div>

                    {/* Terms of Service Box */}
                    <div style={{
                        backgroundColor: '#F2F7F9', padding: '20px', borderRadius: '16px',
                        color: '#5D6D7E', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '24px'
                    }}>
                        Thanks for considering me for your commission! Please only start a request if you find the service details and my Terms of Service acceptable.
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button style={{
                            flex: 1, padding: '16px', borderRadius: '12px', border: 'none',
                            backgroundColor: '#4A9FBF', color: '#FFFFFF', fontWeight: 700,
                            fontSize: '1.05rem', cursor: 'pointer', transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#1A6B8A'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#4A9FBF'}
                        >
                            Accept terms to start request
                        </button>
                        <div style={{
                            backgroundColor: '#E8F5E9', color: '#2ECC71', padding: '16px',
                            borderRadius: '12px', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center'
                        }}>
                            Only {product.slots} slots left
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 3. HALAMAN UTAMA KATEGORI
// ==========================================
function CategoryPage() {
    const { categoryId } = useParams(); // Mengambil kategori dari URL (misal: /category/illustrations)
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Filter data sesuai URL (jika URL tidak valid, tampilkan semua)
    const displayCategory = categoryId || 'illustrations';
    const filteredProducts = mockProducts.filter(p => p.category === displayCategory) || mockProducts;

    // Format judul halaman (dari '2d-avatars' jadi '2D Avatars')
    const pageTitle = displayCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div style={{ backgroundColor: '#F9FCFD', minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>

            {/* Header Kategori */}
            <div style={{ padding: '60px 40px 40px 40px', backgroundColor: '#F2F7F9', borderBottom: '1px solid #E0F2F7' }}>
                <h1 style={{ color: '#1A6B8A', fontSize: '2.5rem', fontWeight: 800, margin: '0 0 16px 0' }}>
                    Custom {pageTitle} <span style={{ fontSize: '1.8rem' }}>✨</span>
                </h1>
                <p style={{ color: '#5D6D7E', fontSize: '1.1rem', margin: 0, maxWidth: '600px' }}>
                    Temukan seniman terbaik untuk mewujudkan {pageTitle.toLowerCase()} impianmu. Dari desain awal hingga hasil akhir yang memukau.
                </p>

                {/* Sub-menu kategori (mirip gambar 2) */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '30px', flexWrap: 'wrap' }}>
                    {['VTuber Model Art', 'Rigging', 'Chibi Style', 'Reactive Avatars', 'GIFtuber'].map(tag => (
                        <span key={tag} style={{
                            padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(74, 159, 191, 0.3)',
                            color: '#1A6B8A', fontSize: '0.9rem', cursor: 'pointer', backgroundColor: '#FFFFFF'
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Grid Produk */}
            <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {filteredProducts.length > 0 ? filteredProducts.map(product => (
                    <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        style={{
                            backgroundColor: '#FFFFFF', borderRadius: '20px', overflow: 'hidden',
                            boxShadow: '0 8px 24px rgba(74, 159, 191, 0.08)', cursor: 'pointer',
                            border: '1px solid rgba(74, 159, 191, 0.1)', transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(74, 159, 191, 0.15)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(74, 159, 191, 0.08)'; }}
                    >
                        <div style={{ position: 'relative' }}>
                            <img src={product.image} alt={product.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                            <div style={{
                                position: 'absolute', top: '12px', left: '12px', backgroundColor: '#E8F5E9',
                                color: '#2ECC71', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold'
                            }}>OPEN</div>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ fontSize: '1.1rem', margin: '0 0 12px 0', color: '#1A6B8A', lineHeight: '1.4' }}>{product.title}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '24px', height: '24px', backgroundColor: '#4A9FBF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem' }}>
                                        {product.artist.charAt(0)}
                                    </div>
                                    <span style={{ fontSize: '0.9rem', color: '#5D6D7E' }}>{product.artist}</span>
                                </div>
                                <span style={{ fontSize: '0.9rem', color: '#F39C12', fontWeight: 'bold' }}>★ {product.rating}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <p style={{ color: '#5D6D7E', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                        Belum ada karya di kategori ini.
                    </p>
                )}
            </div>

            {/* Render Pop-up jika ada produk yang di-klik */}
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