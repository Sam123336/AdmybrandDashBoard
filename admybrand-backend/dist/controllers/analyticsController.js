"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserChartData = exports.getUserMetrics = exports.getCampaigns = exports.getChartData = exports.getMetrics = void 0;
const Analytics_1 = require("../models/Analytics");
const Campaign_1 = require("../models/Campaign");
const getMetrics = async (req, res) => {
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const currentMonthAnalytics = await Analytics_1.Analytics.findOne({
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });
        const startOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const endOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const prevMonthAnalytics = await Analytics_1.Analytics.findOne({
            date: {
                $gte: startOfPrevMonth,
                $lte: endOfPrevMonth
            }
        });
        const currentRevenue = currentMonthAnalytics?.revenue || 0;
        const prevRevenue = prevMonthAnalytics?.revenue || 0;
        const revenueChange = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;
        const currentUsers = currentMonthAnalytics?.users || 0;
        const prevUsers = prevMonthAnalytics?.users || 0;
        const usersChange = prevUsers > 0 ? ((currentUsers - prevUsers) / prevUsers) * 100 : 0;
        const currentConversions = currentMonthAnalytics?.conversions || 0;
        const prevConversions = prevMonthAnalytics?.conversions || 0;
        const conversionsChange = prevConversions > 0 ? ((currentConversions - prevConversions) / prevConversions) * 100 : 0;
        const currentGrowth = currentMonthAnalytics?.growthRate || 0;
        const prevGrowth = prevMonthAnalytics?.growthRate || 0;
        const growthChange = prevGrowth > 0 ? ((currentGrowth - prevGrowth) / prevGrowth) * 100 : 0;
        res.status(200).json({
            success: true,
            data: {
                revenue: {
                    value: currentRevenue,
                    change: revenueChange,
                    trend: revenueChange >= 0 ? 'up' : 'down'
                },
                users: {
                    value: currentUsers,
                    change: usersChange,
                    trend: usersChange >= 0 ? 'up' : 'down'
                },
                conversions: {
                    value: currentConversions,
                    change: conversionsChange,
                    trend: conversionsChange >= 0 ? 'up' : 'down'
                },
                growth: {
                    value: currentGrowth,
                    change: growthChange,
                    trend: growthChange >= 0 ? 'up' : 'down'
                }
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
exports.getMetrics = getMetrics;
const getChartData = async (req, res) => {
    try {
        const { period = '7' } = req.query;
        const days = parseInt(period);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const analyticsData = await Analytics_1.Analytics.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: 1 });
        const lineChartData = analyticsData.map(item => ({
            name: item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: item.revenue,
            users: item.users,
            conversions: item.conversions
        }));
        const latestAnalytics = analyticsData[analyticsData.length - 1] || {};
        const barChartData = [
            { name: 'Social Media', value: latestAnalytics.trafficSources?.socialMedia || 0 },
            { name: 'Email', value: latestAnalytics.trafficSources?.email || 0 },
            { name: 'Direct', value: latestAnalytics.trafficSources?.direct || 0 },
            { name: 'Referral', value: latestAnalytics.trafficSources?.referral || 0 },
            { name: 'Organic', value: latestAnalytics.trafficSources?.organic || 0 },
            { name: 'Paid', value: latestAnalytics.trafficSources?.paid || 0 }
        ];
        const pieChartData = [
            { name: 'Desktop', value: latestAnalytics.deviceDistribution?.desktop || 0, color: '#8884d8' },
            { name: 'Mobile', value: latestAnalytics.deviceDistribution?.mobile || 0, color: '#82ca9d' },
            { name: 'Tablet', value: latestAnalytics.deviceDistribution?.tablet || 0, color: '#ffc658' }
        ];
        res.status(200).json({
            success: true,
            data: {
                lineChart: lineChartData,
                barChart: barChartData,
                pieChart: pieChartData
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
exports.getChartData = getChartData;
const getCampaigns = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const query = {};
        if (status && status !== 'all') {
            query.status = status;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        const campaigns = await Campaign_1.Campaign.find(query)
            .populate('createdBy', 'name email')
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
exports.getCampaigns = getCampaigns;
const getUserMetrics = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const currentMonthCampaigns = await Campaign_1.Campaign.find({
            createdBy: userId,
            startDate: { $lte: endOfMonth },
            endDate: { $gte: startOfMonth }
        });
        const startOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const endOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const prevMonthCampaigns = await Campaign_1.Campaign.find({
            createdBy: userId,
            startDate: { $lte: endOfPrevMonth },
            endDate: { $gte: startOfPrevMonth }
        });
        const currentRevenue = currentMonthCampaigns.reduce((sum, campaign) => sum + (campaign.revenue || 0), 0);
        const prevRevenue = prevMonthCampaigns.reduce((sum, campaign) => sum + (campaign.revenue || 0), 0);
        const revenueChange = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;
        const currentConversions = currentMonthCampaigns.reduce((sum, campaign) => sum + (campaign.conversions || 0), 0);
        const prevConversions = prevMonthCampaigns.reduce((sum, campaign) => sum + (campaign.conversions || 0), 0);
        const conversionsChange = prevConversions > 0 ? ((currentConversions - prevConversions) / prevConversions) * 100 : 0;
        const currentClicks = currentMonthCampaigns.reduce((sum, campaign) => sum + (campaign.clicks || 0), 0);
        const prevClicks = prevMonthCampaigns.reduce((sum, campaign) => sum + (campaign.clicks || 0), 0);
        const clicksChange = prevClicks > 0 ? ((currentClicks - prevClicks) / prevClicks) * 100 : 0;
        const currentSpent = currentMonthCampaigns.reduce((sum, campaign) => sum + (campaign.spent || 0), 0);
        const prevSpent = prevMonthCampaigns.reduce((sum, campaign) => sum + (campaign.spent || 0), 0);
        const spentChange = prevSpent > 0 ? ((currentSpent - prevSpent) / prevSpent) * 100 : 0;
        res.status(200).json({
            success: true,
            data: {
                revenue: {
                    value: currentRevenue,
                    change: revenueChange,
                    trend: revenueChange >= 0 ? 'up' : 'down'
                },
                conversions: {
                    value: currentConversions,
                    change: conversionsChange,
                    trend: conversionsChange >= 0 ? 'up' : 'down'
                },
                clicks: {
                    value: currentClicks,
                    change: clicksChange,
                    trend: clicksChange >= 0 ? 'up' : 'down'
                },
                spent: {
                    value: currentSpent,
                    change: spentChange,
                    trend: spentChange >= 0 ? 'up' : 'down'
                }
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
exports.getUserMetrics = getUserMetrics;
const getUserChartData = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period = '7' } = req.query;
        const days = parseInt(period);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const campaigns = await Campaign_1.Campaign.find({
            createdBy: userId,
            startDate: { $lte: endDate },
            endDate: { $gte: startDate }
        }).sort({ startDate: 1 });
        const lineChartData = campaigns.map(campaign => ({
            name: campaign.name,
            revenue: campaign.revenue || 0,
            spent: campaign.spent || 0,
            clicks: campaign.clicks || 0,
            conversions: campaign.conversions || 0
        }));
        const statusData = await Campaign_1.Campaign.aggregate([
            { $match: { createdBy: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$revenue' },
                    totalSpent: { $sum: '$spent' }
                }
            }
        ]);
        const barChartData = statusData.map(item => ({
            name: item._id,
            campaigns: item.count,
            revenue: item.totalRevenue,
            spent: item.totalSpent
        }));
        const platformData = await Campaign_1.Campaign.aggregate([
            { $match: { createdBy: userId } },
            {
                $group: {
                    _id: '$platform',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$revenue' }
                }
            }
        ]);
        const pieChartData = platformData.map(item => ({
            name: item._id,
            value: item.count,
            revenue: item.totalRevenue
        }));
        res.status(200).json({
            success: true,
            data: {
                lineChart: lineChartData,
                barChart: barChartData,
                pieChart: pieChartData
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
exports.getUserChartData = getUserChartData;
//# sourceMappingURL=analyticsController.js.map