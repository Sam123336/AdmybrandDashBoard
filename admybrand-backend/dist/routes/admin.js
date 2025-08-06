"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.use(admin_1.adminOnly);
router.get('/users', adminController_1.getAllUsers);
router.get('/users/:id', adminController_1.getUserById);
router.put('/users/:id', adminController_1.updateUser);
router.delete('/users/:id', adminController_1.deleteUser);
router.get('/dashboard', adminController_1.getAdminDashboard);
router.get('/campaign-requests', adminController_1.getCampaignRequests);
exports.default = router;
//# sourceMappingURL=admin.js.map