const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Game = require('./Game');

const Favorite = sequelize.define('Favorite', {});

User.belongsToMany(Game, { through: Favorite, as: 'favoriteGames' });
Game.belongsToMany(User, { through: Favorite, as: 'favoritedBy' });

module.exports = Favorite;
