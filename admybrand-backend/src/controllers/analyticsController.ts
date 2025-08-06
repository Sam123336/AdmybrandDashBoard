import { Request, Response } from 'express';
import { Analytics } from '../models/Analytics';
import { Campaign } from '../models/Campaign';

// @desc    Get dashboard metrics
// @route   GET /api/analytics/metrics
// @access  Private
export const getMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get current month analytics
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const currentMonthAnalytics = await Analytics.findOne({
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Get previous month analytics
    const startOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    const prevMonthAnalytics = await Analytics.findOne({
      date: {
        $gte: startOfPrevMonth,
        $lte: endOfPrevMonth
      }
    });

    // Calculate metrics
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

// @desc    Get chart data
// @route   GET /api/analytics/charts
// @access  Private
export const getChartData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = '7' } = req.query;
    const days = parseInt(period as string);

    // Get analytics data for the specified period
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analyticsData = await Analytics.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    // Format data for charts
    const lineChartData = analyticsData.map(item => ({
      name: item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: item.revenue,
      users: item.users,
      conversions: item.conversions
    }));

    // Get traffic sources data
    const latestAnalytics = analyticsData[analyticsData.length - 1] || {};
    const barChartData = [
      { name: 'Social Media', value: latestAnalytics.trafficSources?.socialMedia || 0 },
      { name: 'Email', value: latestAnalytics.trafficSources?.email || 0 },
      { name: 'Direct', value: latestAnalytics.trafficSources?.direct || 0 },
      { name: 'Referral', value: latestAnalytics.trafficSources?.referral || 0 },
      { name: 'Organic', value: latestAnalytics.trafficSources?.organic || 0 },
      { name: 'Paid', value: latestAnalytics.trafficSources?.paid || 0 }
    ];

    // Get device distribution data
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

// @desc    Get campaigns data
// @route   GET /api/analytics/campaigns
// @access  Private
export const getCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Get campaigns with pagination
    const campaigns = await Campaign.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    // Get total count
    const total = await Campaign.countDocuments(query);

    res.status(200).json({
      success: true,
      data: campaigns,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

// @desc    Get user-specific analytics
// @route   GET /api/analytics/user-metrics
// @access  Private
export const getUserMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    
    // Get current month analytics for user's campaigns
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const currentMonthCampaigns = await Campaign.find({
      createdBy: userId,
      startDate: { $lte: endOfMonth },
      endDate: { $gte: startOfMonth }
    });

    // Get previous month analytics for user's campaigns
    const startOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    const prevMonthCampaigns = await Campaign.find({
      createdBy: userId,
      startDate: { $lte: endOfPrevMonth },
      endDate: { $gte: startOfPrevMonth }
    });

    // Calculate metrics from campaigns
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

// @desc    Get user-specific chart data
// @route   GET /api/analytics/user-charts
// @access  Private
export const getUserChartData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { period = '7' } = req.query;
    const days = parseInt(period as string);

    // Get user's campaigns for the specified period
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const campaigns = await Campaign.find({
      createdBy: userId,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    }).sort({ startDate: 1 });

    // Format data for charts
    const lineChartData = campaigns.map(campaign => ({
      name: campaign.name,
      revenue: campaign.revenue || 0,
      spent: campaign.spent || 0,
      clicks: campaign.clicks || 0,
      conversions: campaign.conversions || 0
    }));

    // Get campaign performance by status
    const statusData = await Campaign.aggregate([
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

    // Get platform distribution
    const platformData = await Campaign.aggregate([
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
}; 