import express from 'express';
import { register, login, getMe, logout, updateProfile, getSettings } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

// Profile and settings routes
router.get('/settings', protect, getSettings);
router.put('/profile', protect, updateProfile);

export default router; 