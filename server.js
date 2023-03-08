const path = require('path');
const dotenv = require('dotenv');

// Configuration of env variables
dotenv.config({ path: path.join(__dirname, './config.env') });

const app = require('./app');

// Starting the server
const port = process.env.PORT;
app.listen(port, () => {
	console.log(`Connected to port: ${port}`);
});
