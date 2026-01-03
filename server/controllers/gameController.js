const { Game, User } = require('../models');
const { Op } = require('sequelize');
const axios = require('axios');

exports.getGames = async (req, res) => {
    try {
        const { type, search, limit = 10, offset = 0 } = req.query;
        const where = {};

        if (type && type !== 'all') {
            where.type = type;
        }

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { providerOrLeague: { [Op.iLike]: `%${search}%` } },
                { categoryOrSport: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows: games } = await Game.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            games,
            total: count,
            hasMore: parseInt(offset) + games.length < count
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.toggleFavorite = async (req, res) => {
    try {
        const { gameId } = req.params;
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        const game = await Game.findByPk(gameId);

        if (!game) return res.status(404).json({ message: 'Game not found' });

        const hasFavorite = await user.hasFavoriteGame(game);
        if (hasFavorite) {
            await user.removeFavoriteGame(game);
            res.json({ message: 'Removed from favorites' });
        } else {
            await user.addFavoriteGame(game);
            res.json({ message: 'Added to favorites' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            include: { model: Game, as: 'favoriteGames' },
        });
        res.json(user.favoriteGames);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.manualSeed = async (req, res) => {
    try {
        await Game.bulkCreate([
            { type: 'sport', name: 'IPL: RCB vs KKR', providerOrLeague: 'IPL', categoryOrSport: 'Cricket', startTime: new Date(), imageUrl: 'https://placehold.co/600x400/003366/white?text=Cricket' },
            { type: 'sport', name: 'EPL: Arsenal vs Chelsea', providerOrLeague: 'EPL', categoryOrSport: 'Football', startTime: new Date(), imageUrl: 'https://placehold.co/600x400/cc0000/white?text=Football' },
            { type: 'casino', name: 'Mega Moolah', providerOrLeague: 'Microgaming', categoryOrSport: 'Slots', imageUrl: 'https://placehold.co/600x400/ffcc00/black?text=Slots' },
        ]);
        res.json({ message: 'Seeded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Seeding failed', error: error.message });
    }
};

exports.syncAPI = async (req, res) => {
    const { apiKey } = req.body;
    if (!apiKey) {
        // Fallback or demo if no key
        return res.status(400).json({ message: 'API Key required for live sync' });
    }

    try {
        // Example: Football-Data.org API
        const response = await axios.get('https://api.football-data.org/v4/competitions/PL/matches?limit=5', {
            headers: { 'X-Auth-Token': apiKey }
        });

        const matches = response.data.matches.map(match => ({
            type: 'sport',
            name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
            providerOrLeague: match.competition.name,
            categoryOrSport: 'Football',
            startTime: new Date(match.utcDate),
            imageUrl: 'https://placehold.co/600x400/cc0000/white?text=EPL+Live'
        }));

        await Game.bulkCreate(matches);
        res.json({ message: 'Synced from API successfully', count: matches.length });
    } catch (error) {
        res.status(500).json({ message: 'API Sync failed', error: error.message });
    }
};
