const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./sequelize');
const Customer = require('./customerModel');

class DeliveryAddress extends Model {}

DeliveryAddress.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		customer_email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		fullAddress: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		addressCity: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		addressState: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		addressCountry: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		addressZipCode: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
		contactNumber: {
			type: DataTypes.STRING(15),
			allowNull: false,
		},
	},
	{
		tableName: 'DeliveryAddress',
		timestamps: true,
		sequelize,
	}
);

// Set One to Many relationship between customer and delivery address
Customer.hasMany(DeliveryAddress);
DeliveryAddress.belongsTo(Customer, {
	onDelete: 'CASCADE',
	foreignKey: 'email',
});

// Sync the defined model to database
const sync = async () => {
	await DeliveryAddress.sync({ alter: true });
};

if(process.env.NODE_ENV === 'development') {
	// sync();
}

module.exports = DeliveryAddress;
