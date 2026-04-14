-- ============================================================
-- Singh Automobiles Management System - Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS car_showroom CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE car_showroom;

-- ============================================================
-- USERS TABLE (Admin)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- CARS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  fuel_type ENUM('Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG') NOT NULL,
  transmission ENUM('Manual', 'Automatic', 'CVT', 'Semi-Automatic') NOT NULL,
  kilometers_driven INT NOT NULL DEFAULT 0,
  number_of_owners TINYINT NOT NULL DEFAULT 1,
  price DECIMAL(12, 2) NOT NULL,
  description TEXT,
  main_image VARCHAR(500),
  status ENUM('Available', 'Sold') DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_brand (brand),
  INDEX idx_status (status),
  INDEX idx_fuel_type (fuel_type),
  INDEX idx_year (year),
  INDEX idx_price (price)
) ENGINE=InnoDB;

-- ============================================================
-- CAR IMAGES TABLE (Gallery)
-- ============================================================
CREATE TABLE IF NOT EXISTS car_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  image_path VARCHAR(500) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  INDEX idx_car_id (car_id)
) ENGINE=InnoDB;

-- ============================================================
-- INQUIRIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  city VARCHAR(100) NOT NULL,
  message TEXT,
  status ENUM('New', 'Read', 'Replied') DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL,
  INDEX idx_car_id (car_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- SEED ADMIN USER
-- ⚠️  IMPORTANT: After importing this SQL file, you MUST run:
--     cd backend
--     node scripts/seedAdmin.js
-- This creates a properly bcrypt-hashed admin password.
-- Login: admin@singhautomobiles.in / Admin@123
-- ============================================================

-- ============================================================
-- SAMPLE CAR DATA
-- ============================================================
INSERT INTO cars (title, brand, model, year, fuel_type, transmission, kilometers_driven, number_of_owners, price, description, status) VALUES
('2020 Maruti Swift VXI', 'Maruti', 'Swift', 2020, 'Petrol', 'Manual', 32000, 1, 580000.00, 'Well maintained Swift VXI in excellent condition. Single owner, all service records available. No accidents, clean title.', 'Available'),
('2019 Hyundai Creta SX', 'Hyundai', 'Creta', 2019, 'Diesel', 'Manual', 54000, 1, 1150000.00, 'Hyundai Creta SX diesel with full service history. Loaded with features including sunroof, rear camera, and Apple CarPlay.', 'Available'),
('2021 Honda City ZX', 'Honda', 'City', 2021, 'Petrol', 'CVT', 18000, 1, 1380000.00, 'Honda City ZX CVT in pristine condition. Barely driven, all documents in order. Extended warranty available.', 'Available'),
('2018 Toyota Innova Crysta', 'Toyota', 'Innova Crysta', 2018, 'Diesel', 'Manual', 78000, 2, 1650000.00, 'Toyota Innova Crysta diesel, spacious 7-seater. Perfect for family use, well maintained with complete service history at Toyota.', 'Available'),
('2022 Tata Nexon EV', 'Tata', 'Nexon EV', 2022, 'Electric', 'Automatic', 12000, 1, 1720000.00, 'Tata Nexon EV with 312km range. Comes with home charger, full warranty intact. Future-proof electric SUV.', 'Available'),
('2017 Ford EcoSport Titanium', 'Ford', 'EcoSport', 2017, 'Petrol', 'Automatic', 62000, 2, 720000.00, 'Ford EcoSport Titanium AT with sunroof. All accessories intact, music system upgraded. Minor scratches only.', 'Sold');
