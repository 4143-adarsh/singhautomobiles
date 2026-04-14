const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

/**
 * @desc    Submit a new inquiry (public)
 * @route   POST /api/inquiries
 * @access  Public
 */
const createInquiry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { car_id, full_name, email, phone, city, message } = req.body;

  try {
    // Validate car exists if car_id is provided
    if (car_id) {
      const [car] = await pool.query('SELECT id FROM cars WHERE id = ?', [car_id]);
      if (car.length === 0) {
        return res.status(404).json({ success: false, message: 'Car not found.' });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO inquiries (car_id, full_name, email, phone, city, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [car_id || null, full_name, email, phone, city, message || null]
    );

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully! We will contact you soon.',
      inquiryId: result.insertId,
    });
  } catch (err) {
    console.error('createInquiry error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

/**
 * @desc    Get all inquiries (admin only)
 * @route   GET /api/inquiries
 * @access  Admin
 */
const getInquiries = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT i.*, 
        c.title AS car_title, c.brand AS car_brand, c.model AS car_model
      FROM inquiries i
      LEFT JOIN cars c ON i.car_id = c.id
    `;
    const params = [];

    if (status) {
      query += ' WHERE i.status = ?';
      params.push(status);
    }

    query += ' ORDER BY i.created_at DESC';

    const [rows] = await pool.query(query, params);

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('getInquiries error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc    Update inquiry status (admin only)
 * @route   PUT /api/inquiries/:id
 * @access  Admin
 */
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'Read', 'Replied'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    await pool.query('UPDATE inquiries SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Inquiry status updated' });
  } catch (err) {
    console.error('updateInquiryStatus error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc    Delete inquiry (admin only)
 * @route   DELETE /api/inquiries/:id
 * @access  Admin
 */
const deleteInquiry = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id FROM inquiries WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }
    await pool.query('DELETE FROM inquiries WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    console.error('deleteInquiry error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc    Get dashboard stats (admin only)
 * @route   GET /api/inquiries/stats
 * @access  Admin
 */
const getStats = async (req, res) => {
  try {
    const [[totalCars]] = await pool.query('SELECT COUNT(*) AS total FROM cars');
    const [[availableCars]] = await pool.query("SELECT COUNT(*) AS total FROM cars WHERE status = 'Available'");
    const [[soldCars]] = await pool.query("SELECT COUNT(*) AS total FROM cars WHERE status = 'Sold'");
    const [[totalInquiries]] = await pool.query('SELECT COUNT(*) AS total FROM inquiries');
    const [[newInquiries]] = await pool.query("SELECT COUNT(*) AS total FROM inquiries WHERE status = 'New'");

    res.json({
      success: true,
      data: {
        totalCars: totalCars.total,
        availableCars: availableCars.total,
        soldCars: soldCars.total,
        totalInquiries: totalInquiries.total,
        newInquiries: newInquiries.total,
      },
    });
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { createInquiry, getInquiries, updateInquiryStatus, deleteInquiry, getStats };
