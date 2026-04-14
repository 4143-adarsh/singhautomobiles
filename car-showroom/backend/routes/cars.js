const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getCars, getCarById, createCar, updateCar, deleteCar, deleteCarImage, getBrands,
} = require('../controllers/carController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation rules for car data
const carValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1990, max: new Date().getFullYear() + 1 }).withMessage('Valid year required'),
  body('fuel_type').isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG']).withMessage('Invalid fuel type'),
  body('transmission').isIn(['Manual', 'Automatic', 'CVT', 'Semi-Automatic']).withMessage('Invalid transmission'),
  body('kilometers_driven').isInt({ min: 0 }).withMessage('Kilometers driven must be a positive number'),
  body('number_of_owners').isInt({ min: 1 }).withMessage('Number of owners must be at least 1'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
];

// Upload fields config
const uploadFields = upload.fields([
  { name: 'main_image', maxCount: 1 },
  { name: 'gallery_images', maxCount: 10 },
]);

// Public routes
router.get('/meta/brands', getBrands);
router.get('/', getCars);
router.get('/:id', getCarById);

// Admin protected routes
router.post('/', authMiddleware, uploadFields, carValidation, createCar);
router.put('/:id', authMiddleware, uploadFields, updateCar);
router.delete('/:id', authMiddleware, deleteCar);
router.delete('/:id/images/:imageId', authMiddleware, deleteCarImage);

module.exports = router;
