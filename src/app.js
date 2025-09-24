const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const expenseRoutes = require('./routes/expenses');
// const reportRoutes = require('./routes/reports');

const app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// routes
app.use('/api/users', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
// app.use('/api/reports', reportRoutes);

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;
