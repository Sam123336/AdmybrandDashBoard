import express from 'express';
import { getMetrics, getChartData, getCampaigns, getUserMetrics, getUserChartData } from '../controllers/analyticsController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/metrics', getMetrics);
router.get('/charts', getChartData);
router.get('/campaigns', getCampaigns);

// User-specific analytics routes
router.get('/user-metrics', getUserMetrics);
router.get('/user-charts', getUserChartData);

export default router; 