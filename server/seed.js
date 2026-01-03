const sequelize = require('./config/db');
const { Game } = require('./models');

const seedData = async () => {
    try {
        await sequelize.sync({ force: true });

        await Game.bulkCreate([
            { type: 'sport', name: 'IPL: CSK vs MI', providerOrLeague: 'IPL', categoryOrSport: 'Cricket', startTime: new Date('2026-04-01T19:30:00Z'), imageUrl: 'https://placehold.co/600x400/003366/white?text=Cricket' },
            { type: 'sport', name: 'EPL: Liverpool vs Man City', providerOrLeague: 'EPL', categoryOrSport: 'Football', startTime: new Date('2026-01-10T15:00:00Z'), imageUrl: 'https://placehold.co/600x400/cc0000/white?text=Football' },
            { type: 'sport', name: 'Wimbledon: Alcaraz vs Sinner', providerOrLeague: 'Wimbledon', categoryOrSport: 'Tennis', startTime: new Date('2026-07-01T14:00:00Z'), imageUrl: 'https://placehold.co/600x400/006633/white?text=Tennis' },
            { type: 'casino', name: 'Gonzo\'s Quest', providerOrLeague: 'Evolution', categoryOrSport: 'Slots', imageUrl: 'https://placehold.co/600x400/ffcc00/black?text=Slots' },
            { type: 'casino', name: 'Lightning Roulette', providerOrLeague: 'Pragmatic Play', categoryOrSport: 'Live Casino', imageUrl: 'https://placehold.co/600x400/000000/gold?text=Roulette' },
            { type: 'casino', name: 'Infinite Blackjack', providerOrLeague: 'Evolution', categoryOrSport: 'Table Games', imageUrl: 'https://placehold.co/600x400/0033cc/white?text=Blackjack' },
        ]);

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
