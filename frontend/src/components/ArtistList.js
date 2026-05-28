import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ArtistList() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchArtists();
    }, [category]);

    const fetchArtists = async () => {
        try {
            let url = 'http://localhost:8080/api/artists';
            if (category) {
                url += `/category/${category}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            setArtists(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching artists:', error);
            setLoading(false);
        }
    };

    const filteredArtists = artists.filter(artist =>
        artist.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="artist-list-container">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search artists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
                    <option value="">All Categories</option>
                    <option value="Music">Music</option>
                    <option value="Painting">Painting</option>
                    <option value="Dance">Dance</option>
                    <option value="Theater">Theater</option>
                </select>
            </div>

            <div className="artist-grid">
                {filteredArtists.map(artist => (
                    <Link to={`/artists/${artist.id}`} key={artist.id} className="artist-card">
                        <div className="artist-image">
                            {artist.profilePicture ? (
                                <img src={artist.profilePicture} alt={artist.artistName} />
                            ) : (
                                <div className="placeholder-image">🎨</div>
                            )}
                        </div>
                        <div className="artist-info">
                            <h3>{artist.artistName}</h3>
                            <p className="category">{artist.artCategory}</p>
                            <p className="bio">{artist.bio?.substring(0, 100)}...</p>
                            <div className="stats">
                                <span>👥 {artist.followersCount} followers</span>
                                <span>⭐ {artist.rating}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default ArtistList;