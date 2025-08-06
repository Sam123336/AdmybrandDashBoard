"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analyticsController_1 = require("../controllers/analyticsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.get('/metrics', analyticsController_1.getMetrics);
router.get('/charts', analyticsController_1.getChartData);
router.get('/campaigns', analyticsController_1.getCampaigns);
router.get('/user-metrics', analyticsController_1.getUserMetrics);
router.get('/user-charts', analyticsController_1.getUserChartData);
exports.default = router;
//# sourceMappingURL=analytics.js.map