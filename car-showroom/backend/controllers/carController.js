const { pool } = require('../config/db');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Get all cars with optional filters
 * @route   GET /api/cars
 * @access  Public
 */
const getCars = async (req, res) => {
  try {
    const { brand, fuel_type, min_price, max_price, year, status, search } = req.query;

    let query = `
      SELECT c.*, 
        GROUP_CONCAT(ci.image_path ORDER BY ci.sort_order SEPARATOR '||') AS gallery_images
      FROM cars c
      LEFT JOIN car_images ci ON c.id = ci.car_id
      WHERE 1=1
    `;
    const params = [];

    // Apply filters dynamically
    if (brand) { query += ' AND c.brand = ?'; params.push(brand); }
    if (fuel_type) { query += ' AND c.fuel_type = ?'; params.push(fuel_type); }
    if (year) { query += ' AND c.year = ?'; params.push(year); }
    if (min_price) { query += ' AND c.price >= ?'; params.push(min_price); }
    if (max_price) { query += ' AND c.price <= ?'; params.push(max_price); }
    if (status) { query += ' AND c.status = ?'; params.push(status); }
    if (search) {
      query += ' AND (c.title LIKE ? OR c.brand LIKE ? OR c.model LIKE ?)';
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    query += ' GROUP BY c.id ORDER BY c.created_at DESC';

    const [rows] = await pool.query(query, params);

    // Parse gallery images from concatenated string
    const cars = rows.map(car => ({
      ...car,
      gallery_images: car.gallery_images ? car.gallery_images.split('||') : [],
    }));

    res.json({ success: true, count: cars.length, data: cars });
  } catch (err) {
    console.error('getCars error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc    Get single car by ID
 * @route   GET /api/cars/:id
 * @access  Public
 */
const getCarById = async (req, res) => {
  try {
    const [carRows] = await pool.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);
    if (carRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    const car = carRows[0];

    // Fetch gallery images
    const [imgRows] = await pool.query(
      'SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order',
      [car.id]
    );
    car.gallery_images = imgRows;

    res.json({ success: true, data: car });
  } catch (err) {
    console.error('getCarById error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc    Create new car listing
 * @route   POST /api/cars
 * @access  Admin
 */
const createCar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const {
      title, brand, model, year, fuel_type, transmission,
      kilometers_driven, number_of_owners, price, description, status,
    } = req.body;

    // Handle main image upload
    let mainImage = null;
    let galleryFiles = [];

    if (req.files) {
      if (req.files.main_image && req.files.main_image[0]) {
        mainImage = req.files.main_image[0].filename;
      }
      if (req.files.gallery_images) {
        galleryFiles = req.files.gallery_images.map(f => f.filename);
      }
    }

    // Insert car
    const [result] = await pool.query(
      `INSERT INTO cars (title, brand, model, year, fuel_type, transmission, 
        kilometers_driven, number_of_owners, price, description, main_image, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, brand, model, year, fuel_type, transmission,
        kilometers_driven, number_of_owners, price, description, mainImage,
        status || 'Available']
    );

    const carId = result.insertId;

    // Insert gallery images
    if (galleryFiles.length > 0) {
      const imgValues = galleryFiles.map((file, idx) => [carId, file, idx]);
      await pool.query(
        'INSERT INTO car_images (car_id, image_path, sort_order) VALUES ?',
        [imgValues]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Car listing created successfully',
      carId,
    });
  } catch (err) {
    console.error('createCar error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc    Update car listing
 * @route   PUT /api/cars/:id
 * @access  Admin
 */
const updateCar = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    const car = existing[0];
    const {
      title, brand, model, year, fuel_type, transmission,
      kilometers_driven, number_of_owners, price, description, status,
    } = req.body;

    // Handle new main image
    let mainImage = car.main_image;
    if (req.files && req.files.main_image && req.files.main_image[0]) {
      // Delete old main image
      if (car.main_image) {
        const oldPath = path.join(__dirname, '..', 'uploads', car.main_image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      mainImage = req.files.main_image[0].filename;
    }

    // Update car record
    await pool.query(
      `UPDATE cars SET title=?, brand=?, model=?, year=?, fuel_type=?, transmission=?,
        kilometers_driven=?, number_of_owners=?, price=?, description=?, main_image=?, status=?
       WHERE id=?`,
      [title, brand, model, year, fuel_type, transmission,
        kilometers_driven, number_of_owners, price, description, mainImage, status, req.params.id]
    );

    // Add new gallery images if uploaded
    if (req.files && req.files.gallery_images) {
      const galleryFiles = req.files.gallery_images;
      // Get current max sort_order
      const [maxOrder] = await pool.query(
        'SELECT COALESCE(MAX(sort_order), -1) AS maxOrder FROM car_images WHERE car_id = ?',
        [req.params.id]
      );
      const startOrder = maxOrder[0].maxOrder + 1;
      const imgValues = galleryFiles.map((file, idx) => [req.params.id, file.filename, startOrder + idx]);
      await pool.query('INSERT INTO car_images (car_id, image_path, sort_order) VALUES ?', [imgValues]);
    }

    res.json({ success: true, message: 'Car updated successfully' });
  } catch (err) {
    console.error('updateCar error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc    Delete car listing
 * @route   DELETE /api/cars/:id
 * @access  Admin
 */
const deleteCar = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    const car = rows[0];

    // Delete main image file
    if (car.main_image) {
      const imgPath = path.join(__dirname, '..', 'uploads', car.main_image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    // Delete gallery images files
    const [galleryImgs] = await pool.query('SELECT image_path FROM car_images WHERE car_id = ?', [req.params.id]);
    galleryImgs.forEach(img => {
      const imgPath = path.join(__dirname, '..', 'uploads', img.image_path);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    // Delete from DB (cascade deletes car_images)
    await pool.query('DELETE FROM cars WHERE id = ?', [req.params.id]);

    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (err) {
    console.error('deleteCar error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc    Delete a single gallery image
 * @route   DELETE /api/cars/:id/images/:imageId
 * @access  Admin
 */
const deleteCarImage = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM car_images WHERE id = ? AND car_id = ?', [req.params.imageId, req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }
    const imgPath = path.join(__dirname, '..', 'uploads', rows[0].image_path);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    await pool.query('DELETE FROM car_images WHERE id = ?', [req.params.imageId]);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    console.error('deleteCarImage error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc    Get distinct brands for filter dropdown
 * @route   GET /api/cars/meta/brands
 * @access  Public
 */
const getBrands = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT brand FROM cars ORDER BY brand');
    res.json({ success: true, data: rows.map(r => r.brand) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, deleteCarImage, getBrands };
