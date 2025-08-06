"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaignController_1 = require("../controllers/campaignController");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.post('/', campaignController_1.createCampaign);
router.get('/my-campaigns', campaignController_1.getMyCampaigns);
router.get('/:id', campaignController_1.getCampaignById);
router.delete('/:id', campaignController_1.deleteCampaign);
router.get('/all', admin_1.adminOnly, campaignController_1.getAllCampaigns);
router.put('/:id/status', admin_1.adminOnly, campaignController_1.updateCampaignStatus);
router.put('/:id/metrics', admin_1.adminOnly, campaignController_1.updateCampaignMetrics);
exports.default = router;
//# sourceMappingURL=campaigns.js.map