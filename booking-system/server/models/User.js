const { DataTypes, Model } = require('sequelize');
const sequelize = require('../connection')

class User extends Model {}

User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    group: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modules: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sshkey: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'User',
    timestamps: false
});

module.exports = User;
