import bcrypt from 'bcryptjs';

/**
 * Verify a password against a Laravel bcrypt hash
 * Laravel uses bcrypt with cost factor 10 by default
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Hash a password using bcrypt (for testing or creating new users)
 * Uses cost factor 10 to match Laravel's default
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return await bcrypt.hash(plainPassword, 10);
}
