/**
 * Authentication Routes
 * Defines API endpoints for user authentication
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/auth/register', authController.register);

/**
 * POST /api/auth/login
 * Login existing user
 */
router.post('/auth/login', authController.login);

/**
 * GET /api/auth/me
 * Get current user profile (protected route)
 */
router.get('/auth/me', auth, authController.getProfile);

module.exports = router;
