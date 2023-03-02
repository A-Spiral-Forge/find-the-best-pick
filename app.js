const express = require('express');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoutes');

// Initialize app
const app = express();
// Bodyparser
app.use(express.json());
// Cookie Parser
app.use(cookieParser());

app.use('/api/v1/users', userRouter);

module.exports = app;
