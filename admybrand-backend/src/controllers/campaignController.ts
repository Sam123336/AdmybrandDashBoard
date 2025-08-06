import { Request, Response } from 'express';
import { Campaign } from '../models/Campaign';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Create new campaign (User can request, Admin can create)
// @route   POST /api/campaigns
// @access  Private
export const createCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      budget,
      startDate,
      endDate,
      description,
      targetAudience,
      platform
    } = req.body;

    const userId = req.user._id;
    const user = await User.findById(userId);

    // Set status based on user role
    const status = user?.role === 'admin' ? 'Active' : 'Draft';

    const campaign = await Campaign.create({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

// @desc    Get user's campaigns
// @route   GET /api/campaigns/my-campaigns
// @access  Private
export const getMyCampaigns = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Build query for user's campaigns
    const query: any = { createdBy: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

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

// @desc    Get all campaigns (Admin only)
// @route   GET /api/campaigns/all
// @access  Private (Admin)
export const getAllCampaigns = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, search, userId } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (userId) {
      query.createdBy = userId;
    }

    const campaigns = await Campaign.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

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

// @desc    Update campaign status (Admin only)
// @route   PUT /api/campaigns/:id/status
// @access  Private (Admin)
export const updateCampaignStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('createdBy', 'name email');

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

// @desc    Update campaign metrics (Admin only)
// @route   PUT /api/campaigns/:id/metrics
// @access  Private (Admin)
export const updateCampaignMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      spent,
      impressions,
      clicks,
      conversions,
      revenue
    } = req.body;

    const campaign = await Campaign.findByIdAndUpdate(
      id,
      {
        spent,
        impressions,
        clicks,
        conversions,
        revenue
      },
      { new: true }
    ).populate('createdBy', 'name email');

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

// @desc    Get campaign by ID
// @route   GET /api/campaigns/:id
// @access  Private
export const getCampaignById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id).populate('createdBy', 'name email role');

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
      return;
    }

    // Check if user can access this campaign
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
export const deleteCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
      return;
    }

    // Check if user can delete this campaign
    if (req.user.role !== 'admin' && campaign.createdBy.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this campaign'
      });
      return;
    }

    await Campaign.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
}; 