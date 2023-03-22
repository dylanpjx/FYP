const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection')

class Ticket extends Model {}

Ticket.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ticketType: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Ticket',
    timestamps: false
});

module.exports = Ticket;
