const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to:', process.env.MONGODB_URI);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

// Routes
const compositionsRouter = require('./routes/compositions');
const usersRouter = require('./routes/users');
const aiRouter = require('./routes/ai');

app.use('/api/users', usersRouter);
app.use('/api/compositions', compositionsRouter);
app.use('/api/ai', aiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});