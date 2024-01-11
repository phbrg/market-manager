const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const User = require('./User');
const Product = require('./Product');

const Sale = db.define('Sale', {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

Sale.belongsTo(User);
Sale.belongsTo(Product);
Product.hasMany(Sale);
User.hasMany(Sale);

module.exports = Sale;