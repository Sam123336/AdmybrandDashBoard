import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdminDashboard,
  getCampaignRequests
} from '../controllers/adminController';
import { protect } from '../middleware/auth';
import { adminOnly } from '../middleware/admin';

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(protect);
router.use(adminOnly);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Dashboard and analytics
router.get('/dashboard', getAdminDashboard);
router.get('/campaign-requests', getCampaignRequests);

export default router; 