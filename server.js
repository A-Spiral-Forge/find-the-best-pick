const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, './config.env') });

const app = require('./app');

const dbConfig = require('./config/db.config');
dbConfig.connect(function (err) {
	if (err) throw err;
	console.log('Connected to database...');
});

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`Connected to port: ${port}`);
});
