const mysql2 = require('mysql2');

const devDatabase = {
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
};

const prodDatabase = {
	user: process.env.DB_PROD_USER,
	host: process.env.DB_PROD_HOST,
	database: process.env.DB_PROD_DATABASE,
	password: process.env.DB_PROD_PASSWORD,
	port: process.env.DB_PROD_PORT,
};

module.exports = mysql2.createConnection(
	process.env.NODE_ENV === 'development' ? devDatabase : prodDatabase
);
