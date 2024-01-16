const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const User = require('./User');

const Log = db.define('Log', {
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
      type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE', 'ACESS'),
      allowNull: false
    }
});

Log.belongsTo(User);
User.hasMany(Log);

module.exports = Log;