const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Game = sequelize.define('Game', {
    type: {
        type: DataTypes.ENUM('sport', 'casino'),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    providerOrLeague: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoryOrSport: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Game;
