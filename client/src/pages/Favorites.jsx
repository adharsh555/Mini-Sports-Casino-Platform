import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const res = await api.get('/games/favorites');
            setFavorites(res.data);
        } catch (err) {
            console.error('Error fetching favorites', err);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (gameId) => {
        try {
            await api.post(`/games/favorites/${gameId}`);
            setFavorites(prev => prev.filter(game => game.id !== gameId));
        } catch (err) {
            console.error('Error removing favorite', err);
        }
    };

    if (loading) return <div className="loading">Loading favorites...</div>;

    return (
        <div className="container">
            <h2>Your Favorites</h2>
            <div className="game-grid">
                {favorites.length === 0 ? (
                    <p>You haven't added any favorites yet.</p>
                ) : (
                    favorites.map(game => (
                        <div key={game.id} className="game-card">
                            <img src={game.imageUrl} alt={game.name} className="game-image" />
                            <div className="game-info">
                                <span className="game-category">{game.categoryOrSport}</span>
                                <h3 className="game-name">{game.name}</h3>
                                <p className="game-provider">{game.providerOrLeague}</p>
                                <div className="game-actions">
                                    <button
                                        onClick={() => removeFavorite(game.id)}
                                        style={{ backgroundColor: '#ef4444', color: 'white' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Favorites;
