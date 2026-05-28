// frontend/src/components/ArtistDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ArtistDetail() {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArtistDetails();
        fetchArtworks();
    }, [id]);

    const fetchArtistDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/artists/${id}`);
            const data = await response.json();
            setArtist(data);
        } catch (error) {
            console.error('Error fetching artist details:', error);
        }
    };

    const fetchArtworks = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/artworks/artist/${id}`);
            const data = await response.json();
            setArtworks(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching artworks:', error);
            setLoading(false);
        }
    };

    if (loading || !artist) return <div className="loading">Loading...</div>;

    return (
        <div className="artist-detail">
            <div className="artist-header">
                <div className="artist-avatar">
                    {artist.profilePicture ? (
                        <img src={artist.profilePicture} alt={artist.artistName} />
                    ) : (
                        <div className="placeholder-avatar">🎭</div>
                    )}
                </div>
                <div className="artist-header-info">
                    <h1>{artist.artistName}</h1>
                    <p className="real-name">{artist.fullName}</p>
                    <p className="category-badge">{artist.artCategory}</p>
                    <div className="social-links">
                        {artist.instagram && <a href={artist.instagram} target="_blank">📷 Instagram</a>}
                        {artist.youtube && <a href={artist.youtube} target="_blank">▶️ YouTube</a>}
                        {artist.tiktok && <a href={artist.tiktok} target="_blank">🎵 TikTok</a>}
                    </div>
                </div>
            </div>

            <div className="artist-bio">
                <h2>Biografi</h2>
                <p>{artist.bio}</p>
            </div>

            <div className="artist-portfolio">
                <h2>Portfolio</h2>
                {artist.portfolio && (
                    <div className="portfolio-link">
                        <a href={artist.portfolio} target="_blank">Lihat Portfolio Lengkap →</a>
                    </div>
                )}
            </div>

            <div className="artworks-section">
                <h2>Karya Seni</h2>
                <div className="artworks-grid">
                    {artworks.map(artwork => (
                        <div key={artwork.id} className="artwork-card">
                            <img src={artwork.imageUrl} alt={artwork.title} />
                            <h4>{artwork.title}</h4>
                            <p>{artwork.description}</p>
                            <div className="artwork-stats">
                                <span>❤️ {artwork.likesCount}</span>
                                <span>👁️ {artwork.viewsCount}</span>
                                <span>💰 Rp {artwork.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="artist-actions">
                <button className="follow-btn">Follow Artist</button>
                <button className="contact-btn">Contact Artist</button>
            </div>
        </div>
    );
}

export default ArtistDetail;