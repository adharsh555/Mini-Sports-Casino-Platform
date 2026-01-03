const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const { Game } = require('./models');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

const PORT = process.env.PORT || 5000;

const syncDatabase = async (retries = 5) => {
    while (retries) {
        try {
            await sequelize.sync({ alter: true });
            console.log('Database synced');

            // Auto-seed if empty
            const count = await Game.count();
            if (count === 0) {
                console.log('Database empty, seeding initial data...');
                await Game.bulkCreate([
                    { type: 'sport', name: 'IPL: CSK vs MI', providerOrLeague: 'IPL', categoryOrSport: 'Cricket', startTime: new Date('2026-04-01T19:30:00Z'), imageUrl: 'https://placehold.co/600x400/003366/white?text=Cricket' },
                    { type: 'sport', name: 'EPL: Liverpool vs Man City', providerOrLeague: 'EPL', categoryOrSport: 'Football', startTime: new Date('2026-01-10T15:00:00Z'), imageUrl: 'https://placehold.co/600x400/cc0000/white?text=Football' },
                    { type: 'sport', name: 'Wimbledon: Alcaraz vs Sinner', providerOrLeague: 'Wimbledon', categoryOrSport: 'Tennis', startTime: new Date('2026-07-01T14:00:00Z'), imageUrl: 'https://placehold.co/600x400/006633/white?text=Tennis' },
                    { type: 'casino', name: 'Gonzo\'s Quest', providerOrLeague: 'Evolution', categoryOrSport: 'Slots', imageUrl: 'https://placehold.co/600x400/ffcc00/black?text=Slots' },
                    { type: 'casino', name: 'Lightning Roulette', providerOrLeague: 'Pragmatic Play', categoryOrSport: 'Live Casino', imageUrl: 'https://placehold.co/600x400/000000/gold?text=Roulette' },
                    { type: 'casino', name: 'Infinite Blackjack', providerOrLeague: 'Evolution', categoryOrSport: 'Table Games', imageUrl: 'https://placehold.co/600x400/0033cc/white?text=Blackjack' },
                    { type: 'sport', name: 'NBA: Lakers vs Celtics', providerOrLeague: 'NBA', categoryOrSport: 'Basketball', startTime: new Date('2026-02-15T19:00:00Z'), imageUrl: 'https://placehold.co/600x400/552583/white?text=NBA' },
                    { type: 'casino', name: 'Sugar Rush', providerOrLeague: 'Pragmatic Play', categoryOrSport: 'Slots', imageUrl: 'https://placehold.co/600x400/ff69b4/white?text=Sugar+Rush' },
                    { type: 'sport', name: 'F1: Monaco Grand Prix', providerOrLeague: 'Formula 1', categoryOrSport: 'Racing', startTime: new Date('2026-05-24T14:00:00Z'), imageUrl: 'https://placehold.co/600x400/e10600/white?text=F1' },
                ]);
                console.log('Auto-seeding complete.');
            }

            if (process.env.NODE_ENV !== 'test') {
                app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
            }
            break;
        } catch (err) {
            console.error('Error syncing database, retrying...', err);
            retries -= 1;
            console.log(`Retries left: ${retries}`);
            if (retries === 0) {
                console.error('Could not connect to database after several attempts');
                process.exit(1);
            }
            // Wait 5 seconds before retrying
            await new Promise(res => setTimeout(res, 5000));
        }
    }
};

syncDatabase();

module.exports = app;
