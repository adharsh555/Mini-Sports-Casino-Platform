import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [games, setGames] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const limit = 6; // Small limit for demo purposes

    useEffect(() => {
        setPage(0);
        fetchData(0, true);
    }, [filter, search]);

    const fetchData = async (pageNum, isNew = false) => {
        if (isNew) setLoading(true);
        else setLoadingMore(true);

        try {
            const typeParam = filter === 'all' ? '' : `type=${filter}`;
            const searchParam = search ? `&search=${search}` : '';
            const paginationParam = `&limit=${limit}&offset=${pageNum * limit}`;

            const [gamesRes, favRes] = await Promise.all([
                api.get(`/games?${typeParam}${searchParam}${paginationParam}`),
                api.get('/games/favorites')
            ]);

            if (isNew) {
                setGames(gamesRes.data.games);
            } else {
                setGames(prev => [...prev, ...gamesRes.data.games]);
            }

            setHasMore(gamesRes.data.hasMore);
            setFavorites(favRes.data.map(f => f.id));
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchData(nextPage, false);
    };

    const toggleFavorite = async (gameId) => {
        try {
            await api.post(`/games/favorites/${gameId}`);
            setFavorites(prev =>
                prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
            );
        } catch (err) {
            console.error('Error toggling favorite', err);
        }
    };

    const handleManualSeed = async () => {
        setLoading(true);
        try {
            await api.post('/games/seed');
            setPage(0);
            await fetchData(0, true);
            alert('Data seeded successfully!');
        } catch (err) {
            console.error('Error seeding data', err);
            alert('Seeding failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleAPISync = async () => {
        const apiKey = prompt("Please enter your Football-Data.org API Key (or leave blank for demo):");
        setLoading(true);
        try {
            await api.post('/games/sync-api', { apiKey });
            setPage(0);
            await fetchData(0, true);
            alert('API Sync complete!');
        } catch (err) {
            console.error('Error syncing API', err);
            alert('API Sync failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="dashboard-header">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by game, provider or team..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filters">
                    <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                    <button className={`filter-btn ${filter === 'sport' ? 'active' : ''}`} onClick={() => setFilter('sport')}>Sports</button>
                    <button className={`filter-btn ${filter === 'casino' ? 'active' : ''}`} onClick={() => setFilter('casino')}>Casino</button>
                </div>
            </div>

            <h2>{filter === 'all' ? 'All Activities' : filter === 'sport' ? 'Sports Matches' : 'Casino Games'}</h2>

            {loading && page === 0 ? (
                <div className="loading">Loading games...</div>
            ) : (
                <>
                    <div className="game-grid">
                        {games.length === 0 ? (
                            <div className="empty-state">
                                <p>No items found.</p>
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <button className="primary-btn" onClick={handleManualSeed}>Seed Mock Data</button>
                                    <button className="secondary-btn" onClick={handleAPISync}>Source from API</button>
                                </div>
                            </div>
                        ) : (
                            games.map(game => (
                                <div key={game.id} className="game-card">
                                    <img src={game.imageUrl} alt={game.name} className="game-image" />
                                    <div className="game-info">
                                        <span className="game-category">{game.categoryOrSport}</span>
                                        <h3 className="game-name">{game.name}</h3>
                                        <p className="game-provider">{game.providerOrLeague}</p>
                                        {game.startTime && (
                                            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                                Starts: {new Date(game.startTime).toLocaleString()}
                                            </p>
                                        )}
                                        <div className="game-actions">
                                            <button
                                                onClick={() => toggleFavorite(game.id)}
                                                style={{
                                                    backgroundColor: favorites.includes(game.id) ? '#ef4444' : '#f1f5f9',
                                                    color: favorites.includes(game.id) ? 'white' : '#1e293b'
                                                }}
                                            >
                                                {favorites.includes(game.id) ? '❤️ Favorited' : '🤍 Favorite'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {hasMore && (
                        <div className="load-more">
                            <button
                                className="load-more-btn"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
