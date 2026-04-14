const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createInquiry, getInquiries, updateInquiryStatus, deleteInquiry, getStats,
} = require('../controllers/inquiryController');
const authMiddleware = require('../middleware/auth');

// Validation for inquiry submission
const inquiryValidation = [
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required')
    .isLength({ min: 7, max: 15 }).withMessage('Invalid phone number'),
  body('city').trim().notEmpty().withMessage('City is required'),
];

// Public route
router.post('/', inquiryValidation, createInquiry);

// Admin protected routes
router.get('/stats', authMiddleware, getStats);
router.get('/', authMiddleware, getInquiries);
router.put('/:id', authMiddleware, updateInquiryStatus);
router.delete('/:id', authMiddleware, deleteInquiry);

module.exports = router;
