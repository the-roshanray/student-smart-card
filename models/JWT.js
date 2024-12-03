
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET 

/**
 * Verifies the provided token
 * @param {string} token - The JWT token to verify
 * @returns {object|null} - Returns the decoded token if valid, null if invalid
 */
export function verifyToken(token) {
  try {
    // Verifying the token
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // If verification fails, return null
    return null;
  }
}
