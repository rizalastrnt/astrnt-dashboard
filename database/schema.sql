-- Database Setup Script for Astrnt Dashboard
-- This script creates the necessary database and table structure

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS astrnt_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE astrnt_db;

-- Create cwa_users table
CREATE TABLE IF NOT EXISTS cwa_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL COMMENT 'bcrypt hashed password (Laravel compatible)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Example: Insert a test user
-- Password below is hashed version of 'password123'
-- To generate your own hash, use the lib/auth.ts hashPassword function
-- or Laravel's Hash::make() method

INSERT INTO cwa_users (email, password) 
VALUES (
  'admin@example.com', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
)
ON DUPLICATE KEY UPDATE email = email;

-- Note: The above password is 'password' hashed with bcrypt cost 10
-- For security, change this immediately after first login

-- Optional: View users table structure
DESCRIBE cwa_users;

-- Optional: View inserted users (passwords will be hidden)
SELECT id, email, created_at, updated_at FROM cwa_users;
