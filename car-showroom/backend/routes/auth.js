const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, register, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Routes
router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);
router.get('/me', authMiddleware, getMe);

module.exports = router;
