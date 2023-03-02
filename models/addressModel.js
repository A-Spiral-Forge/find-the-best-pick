const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const Customer = require('./customerModel');

const DeliveryAddress = sequelize.define('DeliveryAddress', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	customer_email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	addressStreet: {
		tyep: DataTypes.STRING,
		allowNull: false,
	},
	addressCity: {
		tyep: DataTypes.STRING,
		allowNull: false,
	},
	addressState: {
		tyep: DataTypes.STRING,
		allowNull: false,
	},
	addressCountry: {
		tyep: DataTypes.STRING,
		allowNull: false,
	},
	addressZipCode: {
		tyep: DataTypes.STRING(10),
		allowNull: false,
	},
	contactNumber: {
		tyep: DataTypes.STRING(15),
		allowNull: false,
	},
});

Customer.hasMany(DeliveryAddress);
DeliveryAddress.belongsTo(Customer, {
	onDelete: 'CASCADE',
	foreignKey: 'customer_email',
});

module.exports = DeliveryAddress;
