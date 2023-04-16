const { Sequelize, Op, DataTypes, Model } = require('sequelize');
const sequelize = require('./sequelize');
const AppError = require('../utils/appError');

class ProductSpecifications extends Model {};

ProductSpecifications.init(
    {
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
        },
        value: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        }
    },
    {
        sequelize,
        timestamps: true,
        tableName: 'ProductSpecifications',
    }
);

// Sync the defined model to database
const sync = async () => {
	await ProductSpecifications.sync({ alter: true });
};
// sync();

module.exports = ProductSpecifications;