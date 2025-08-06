"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCampaignRequests = exports.getAdminDashboard = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const User_1 = require("../models/User");
const Campaign_1 = require("../models/Campaign");
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, role } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role && role !== 'all') {
            query.role = role;
        }
        const users = await User_1.User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        const total = await User_1.User.countDocuments(query);
        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.User.findById(id).select('-password');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        const campaigns = await Campaign_1.Campaign.find({ createdBy: id })
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json({
            success: true,
            data: {
                user,
                campaigns
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, isActive } = req.body;
        const user = await User_1.User.findByIdAndUpdate(id, { name, email, role, isActive }, { new: true }).select('-password');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user,
            message: 'User updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.User.findById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        await Campaign_1.Campaign.deleteMany({ createdBy: id });
        await User_1.User.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'User and associated campaigns deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
exports.deleteUser = deleteUser;
const getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User_1.User.countDocuments();
        const activeUsers = await User_1.User.countDocuments({ isActive: true });
        const adminUsers = await User_1.User.countDocuments({ role: 'admin' });
        const totalCampaigns = await Campaign_1.Campaign.countDocuments();
        const activeCampaigns = await Campaign_1.Campaign.countDocuments({ status: 'Active' });
        const draftCampaigns = await Campaign_1.Campaign.countDocuments({ status: 'Draft' });
        const revenueStats = await Campaign_1.Campaign.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$revenue' },
                    totalSpent: { $sum: '$spent' },
                    totalImpressions: { $sum: '$impressions' },
                    totalClicks: { $sum: '$clicks' },
                    totalConversions: { $sum: '$conversions' }
                }
            }
        ]);
        const stats = revenueStats[0] || {
            totalRevenue: 0,
            totalSpent: 0,
            totalImpressions: 0,
            totalClicks: 0,
            totalConversions: 0
        };
        const recentCampaigns = await Campaign_1.Campaign.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);
        const recentUsers = await User_1.User.find()
            .select('name email role createdAt')
            .sort({ createdAt: -1 })
            .limit(5);
        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    admins: adminUsers
                },
                campaigns: {
                    total: totalCampaigns,
                    active: activeCampaigns,
                    draft: draftCampaigns
                },
                revenue: {
                    total: stats.totalRevenue,
                    spent: stats.totalSpent,
                    impressions: stats.totalImpressions,
                    clicks: stats.totalClicks,
                    conversions: stats.totalConversions
                },
                recentCampaigns,
                recentUsers
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
exports.getAdminDashboard = getAdminDashboard;
const getCampaignRequests = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const campaigns = await Campaign_1.Campaign.find({ status: 'Draft' })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        const total = await Campaign_1.Campaign.countDocuments({ status: 'Draft' });
        res.status(200).json({
            success: true,
            data: campaigns,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
exports.getCampaignRequests = getCampaignRequests;
//# sourceMappingURL=adminController.js.map