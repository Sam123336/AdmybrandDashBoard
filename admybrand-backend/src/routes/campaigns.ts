import express from 'express';
import {
  createCampaign,
  getMyCampaigns,
  getAllCampaigns,
  updateCampaignStatus,
  updateCampaignMetrics,
  getCampaignById,
  deleteCampaign
} from '../controllers/campaignController';
import { protect } from '../middleware/auth';
import { adminOnly } from '../middleware/admin';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// User routes
router.post('/', createCampaign);
router.get('/my-campaigns', getMyCampaigns);
router.get('/:id', getCampaignById);
router.delete('/:id', deleteCampaign);

// Admin routes
router.get('/all', adminOnly, getAllCampaigns);
router.put('/:id/status', adminOnly, updateCampaignStatus);
router.put('/:id/metrics', adminOnly, updateCampaignMetrics);

export default router; 