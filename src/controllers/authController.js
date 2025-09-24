const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { User } = require('../models');
const { isValidEmail } = require('../utils/validators');
require('dotenv').config();

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

if (!jwtSecret) {
  console.error('JWT_SECRET not set');
  process.exit(1);
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }
  if (name.length > 100) return res.status(400).json({ message: 'name too long' });
  if (!isValidEmail(email)) return res.status(400).json({ message: 'invalid email' });
  if (password.length < 8) return res.status(400).json({ message: 'password must be at least 8 characters' });

  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(409).json({ message: 'email already registered' });

  const hashed = await bcrypt.hash(password, saltRounds);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: user.id, name: user.name, email: user.email }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: jwtExpiresIn });

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

module.exports = { register, login };
