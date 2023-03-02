const { Sequelize, Op, DataTypes, Model } = require('sequelize');
const sequelize = require('./sequelize');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');
// const validator = require('validator');

class Customer extends Model {}

Customer.init(
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
					const customer = await Customer.findOne({
						where: {
							email: value,
						},
					});

					if (customer) {
						throw new AppError(
							'User already exists with this Email.',
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
				isAlpha: {
					msg: 'Name must only contain letters.',
				},
				notEmpty: {
					msg: 'Name cannot be empty.',
				},
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
		dateOfBirth: {
			type: DataTypes.DATEONLY,
			validate: {
				isDate: {
					args: true,
					msg: 'Please provide a valid date.',
				},
			},
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
					const customer = await Customer.findOne({
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

					if (customer) {
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
					const customer = await Customer.findOne({
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

					if (customer) {
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
		role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'customer',
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		sequelize,
		tableName: 'customer',
	}
);

// const sync = async () => {
// 	await Customer.sync({ alter: true });
// };

// sync();

Customer.beforeValidate((instance, options) => {
	instance.passwordChangedAt = new Date(Date.now());
});

Customer.beforeCreate((instance, options) => {
	instance.password = bcrypt.hashSync(instance.password, 12);
});

// Customer.beforeFind((instance, options) => {
// 	instance.where.active = true;
// });

Customer.prototype.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

module.exports = Customer;
