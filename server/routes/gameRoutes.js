const express = require('express');
const router = express.Router();
const { getGames, toggleFavorite, getFavorites } = require('../controllers/gameController');
const auth = require('../middleware/auth');

router.get('/', auth, getGames);
router.get('/favorites', auth, getFavorites);
router.post('/favorites/:gameId', auth, toggleFavorite);
router.post('/seed', auth, require('../controllers/gameController').manualSeed);
router.post('/sync-api', auth, require('../controllers/gameController').syncAPI);

module.exports = router;
