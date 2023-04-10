const { Sequelize, Op, DataTypes, Model } = require('sequelize');
const sequelize = require('./sequelize');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

class Seller extends Model {}

Seller.init(
	{
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			validate: {
				isEmail: {
					msg: 'Please provide a valid email address.',
				},
				async isUnique(value) {
					const seller = await Seller.findOne({
						where: {
							email: value,
						},
					});

					if (seller) {
						throw new AppError(
							'Seller already exists with this Email.',
							400
						);
					}
				},
			},
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
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: {
					args: [8, 100],
					msg: 'Password must be at least 8 characters long.',
				},
			},
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
		contactNumber1: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: 'Contact number cannot be empty.',
				},
				async isUnique(value) {
					console.log(value);
					const seller = await Seller.findOne({
						where: {
							[Op.or]: [
								{
									contactNumber1: value,
								},
								{
									contactNumber2: value ? value : -1,
								},
							],
						},
					});

					if (seller) {
						throw new AppError(
							'User already exists with this contact number.',
							400
						);
					}
				},
			},
		},
		contactNumber2: {
			type: DataTypes.STRING,
			validate: {
				async isUnique(value) {
					console.log(value);
					const seller = await Seller.findOne({
						where: {
							[Op.or]: [
								{
									contactNumber1: value,
								},
								{
									contactNumber2: value ? value : -1,
								},
							],
						},
					});

					if (seller) {
						throw new AppError(
							'User already exists with this contact number.',
							400
						);
					}
				},
			},
		},
		passwordChangedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		passwordResetToken: {
			type: DataTypes.STRING,
		},
		passwordResetExpires: {
			type: DataTypes.DATE,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false,
		},
		accountNumber: {
			type: DataTypes.STRING(20),
		},
		ifsc: {
			type: DataTypes.STRING(20),
		},
		accountHoldersName: {
			type: DataTypes.STRING(50),
		},
		amazonBalanceInDollars: {
			type: DataTypes.DECIMAL(2),
			defaultValue: 0,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		sequelize,
		tableName: 'Seller',
	}
);

// Sync model to database
const sync = async () => {
	await Customer.sync({ alter: true });
};

if (process.env.NODE_ENV === 'development') {
	// sync();
}

// Adding timestamp of password changed
Seller.beforeValidate((instance, options) => {
	instance.passwordChangedAt = new Date(Date.now());
});

// Hashing the password to protect from data breach attacks
Seller.beforeCreate((instance, options) => {
	instance.password = bcrypt.hashSync(instance.password, 12);
});

/**
 * Check whether password is changed after login or creating JWT
 * @param {String} JWTTimestamp Timestamp from JSON Web Token
 * @returns {Boolean} Return true if password is changed after login, false otherwise
 */
Seller.prototype.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

module.exports = Seller;
