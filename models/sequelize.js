'use strict';

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
	process.env.NODE_ENV === 'development'
		? process.env.DB_DATABASE
		: process.env.DB_PROD_DATABASE,
	process.env.NODE_ENV === 'development'
		? process.env.DB_USER
		: process.env.DB_PROD_USER,
	process.env.NODE_ENV === 'development'
		? process.env.DB_PASSWORD
		: process.env.DB_PROD_PASSWORD,
	{
		host:
			process.env.NODE_ENV === 'development'
				? process.env.DB_host
				: process.env.DB_PROD_HOST,
		dialect: 'mysql',
	}
);

module.exports = sequelize;
