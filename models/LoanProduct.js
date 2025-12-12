const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LoanProduct = sequelize.define('LoanProduct', {
    loan_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
}, {
    timestamps: false,
});

module.exports = LoanProduct;
