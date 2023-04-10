const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./sequelize');
const Customer = require('./customerModel');

class DeliveryAddress extends Model {};

DeliveryAddress.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		customerEmail: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		fullName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: 'Name cannot be empty.',
				},
				is: /^[a-zA-Z ]*$/,
			},
		},
		fullAddress: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		state: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		country: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		zipCode: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
		contactNumber: {
			type: DataTypes.STRING(15),
			allowNull: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false,
		}
	},
	{
		tableName: 'DeliveryAddress',
		timestamps: true,
		sequelize,
	}
);

// Set One to Many relationship between customer and delivery address
// Customer.hasMany(DeliveryAddress);
DeliveryAddress.belongsTo(Customer, {
	onDelete: 'CASCADE',
	foreignKey: 'customerEmail',
	targetKey: 'email'
});

// Sync the defined model to database
const sync = async () => {
	await DeliveryAddress.sync({ alter: true });
};

if(process.env.NODE_ENV === 'development') {
	// sync();
}

module.exports = DeliveryAddress;
