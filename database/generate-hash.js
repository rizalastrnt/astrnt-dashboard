#!/usr/bin/env node
/**
 * Password Hash Generator
 * 
 * This script generates bcrypt password hashes compatible with Laravel
 * Usage: node database/generate-hash.js <password>
 * 
 * Example:
 *   node database/generate-hash.js mypassword123
 */

const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = process.argv[2];

  if (!password) {
    console.error('Error: Please provide a password');
    console.log('\nUsage: node database/generate-hash.js <password>');
    console.log('Example: node database/generate-hash.js mypassword123\n');
    process.exit(1);
  }

  try {
    console.log('Generating bcrypt hash...\n');
    
    // Generate hash with cost factor 10 (Laravel default)
    const hash = await bcrypt.hash(password, 10);
    
    console.log('Password:', password);
    console.log('Bcrypt Hash:', hash);
    console.log('\nYou can use this hash in your SQL INSERT statement:');
    console.log(`INSERT INTO cwa_users (email, password) VALUES ('user@example.com', '${hash}');`);
    console.log('\n');
  } catch (error) {
    console.error('Error generating hash:', error.message);
    process.exit(1);
  }
}

generateHash();
