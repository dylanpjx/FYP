const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('fyp', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
