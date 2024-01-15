const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const User = require('./User');

const Sale = db.define('Sale', {
    products: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false
    },
});

Sale.belongsTo(User);
User.hasMany(Sale);

module.exports = Sale;