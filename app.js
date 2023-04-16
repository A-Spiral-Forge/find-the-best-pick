const express = require('express');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const globalErrorHandler = require('./controllers/errorController');

// Initialize app
const app = express();
// Bodyparser
app.use(express.json());
// Cookie Parser
app.use(cookieParser());
// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
// Adding error handler
app.use(globalErrorHandler);

module.exports = app;
