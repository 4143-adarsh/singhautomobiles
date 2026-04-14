/**
 * Seed Pintu Singh Script
 * 
 * HOW TO RUN:
 *   cd backend
 *   node scripts/seedAdmin.js
 */

// Load .env from backend folder (where this script is run from)
require('dotenv').config();

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const run = async () => {
  console.log('🔐 Connecting to database...');
  
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'car_showroom',
  });

  console.log('✅ Connected!');

  const adminEmail    = 'admin@singhautomobiles.in';
  const adminPassword = 'Admin@123';
  const adminName     = 'Pintu Singh';

  // Hash the password with bcrypt (12 rounds)
  console.log('🔒 Hashing password...');
  const salt           = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  // Delete any existing admin with this email to avoid duplicates
  await conn.query('DELETE FROM users WHERE email = ?', [adminEmail]);

  // Insert fresh admin with properly hashed password
  await conn.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [adminName, adminEmail, hashedPassword, 'admin']
  );

  console.log('');
  console.log('✅ Admin user created successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Email    : ${adminEmail}`);
  console.log(`   Password : ${adminPassword}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('👉 You can now login at: http://localhost:5173/admin/login');

  await conn.end();
  process.exit(0);
};

run().catch(err => {
  console.error('');
  console.error('❌ Seed FAILED:', err.message);
  console.error('');
  console.error('Common reasons:');
  console.error('  1. MySQL is not running');
  console.error('  2. Wrong DB_PASSWORD in your .env file');
  console.error('  3. Database "car_showroom" does not exist yet (run database.sql first)');
  console.error('');
  process.exit(1);
});
