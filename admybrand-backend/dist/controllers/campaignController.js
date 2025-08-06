"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCampaign = exports.getCampaignById = exports.updateCampaignMetrics = exports.updateCampaignStatus = exports.getAllCampaigns = exports.getMyCampaigns = exports.createCampaign = void 0;
const Campaign_1 = require("../models/Campaign");
const User_1 = require("../models/User");
const createCampaign = async (req, res) => {
    try {
        const { name, budget, startDate, endDate, description, targetAudience, platform } = req.body;
        const userId = req.user._id;
        const user = await User_1.User.findById(userId);
        const status = user?.role === 'admin' ? 'Active' : 'Draft';
        const campaign = await Campaign_1.Campaign.create({
            name,
            status,
            budget,
            startDate,
            endDate,
            description,
            targetAudience,
            platform,
            createdBy: userId
        });
        res.status(201).json({
            success: true,
            data: campaign,
            message: user?.role === 'admin' ? 'Campaign created successfully' : 'Campaign request submitted successfully'
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
exports.createCampaign = createCampaign;
const getMyCampaigns = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const query = { createdBy: req.user._id };
        if (status && status !== 'all') {
            query.status = status;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        const campaigns = await Campaign_1.Campaign.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        const total = await Campaign_1.Campaign.countDocuments(query);
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
exports.getMyCampaigns = getMyCampaigns;
const getAllCampaigns = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search, userId } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const query = {};
        if (status && status !== 'all') {
            query.status = status;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (userId) {
            query.createdBy = userId;
        }
        const campaigns = await Campaign_1.Campaign.find(query)
            .populate('createdBy', 'name email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        const total = await Campaign_1.Campaign.countDocuments(query);
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
exports.getAllCampaigns = getAllCampaigns;
const updateCampaignStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const campaign = await Campaign_1.Campaign.findByIdAndUpdate(id, { status }, { new: true }).populate('createdBy', 'name email');
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: campaign,
            message: 'Campaign status updated successfully'
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
exports.updateCampaignStatus = updateCampaignStatus;
const updateCampaignMetrics = async (req, res) => {
    try {
        const { id } = req.params;
        const { spent, impressions, clicks, conversions, revenue } = req.body;
        const campaign = await Campaign_1.Campaign.findByIdAndUpdate(id, {
            spent,
            impressions,
            clicks,
            conversions,
            revenue
        }, { new: true }).populate('createdBy', 'name email');
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: campaign,
            message: 'Campaign metrics updated successfully'
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
exports.updateCampaignMetrics = updateCampaignMetrics;
const getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign_1.Campaign.findById(id).populate('createdBy', 'name email role');
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
            return;
        }
        if (req.user.role !== 'admin' && campaign.createdBy._id.toString() !== req.user._id.toString()) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to access this campaign'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: campaign
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
exports.getCampaignById = getCampaignById;
const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign_1.Campaign.findById(id);
        if (!campaign) {
            res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
            return;
        }
        if (req.user.role !== 'admin' && campaign.createdBy.toString() !== req.user._id.toString()) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to delete this campaign'
            });
            return;
        }
        await Campaign_1.Campaign.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Campaign deleted successfully'
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
exports.deleteCampaign = deleteCampaign;
//# sourceMappingURL=campaignController.js.map