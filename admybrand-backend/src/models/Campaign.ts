import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  name: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Draft';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  revenue: number;
  startDate: Date;
  endDate?: Date;
  description?: string;
  targetAudience?: string;
  platform: 'Google Ads' | 'Facebook Ads' | 'Instagram Ads' | 'LinkedIn Ads' | 'Twitter Ads';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>({
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
    maxlength: [100, 'Campaign name cannot be more than 100 characters']
  },
  status: {
    type: String,
    enum: ['Active', 'Paused', 'Completed', 'Draft'],
    default: 'Draft'
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [0, 'Budget cannot be negative']
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent cannot be negative']
  },
  impressions: {
    type: Number,
    default: 0,
    min: [0, 'Impressions cannot be negative']
  },
  clicks: {
    type: Number,
    default: 0,
    min: [0, 'Clicks cannot be negative']
  },
  ctr: {
    type: Number,
    default: 0,
    min: [0, 'CTR cannot be negative'],
    max: [100, 'CTR cannot exceed 100%']
  },
  cpc: {
    type: Number,
    default: 0,
    min: [0, 'CPC cannot be negative']
  },
  conversions: {
    type: Number,
    default: 0,
    min: [0, 'Conversions cannot be negative']
  },
  revenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  targetAudience: {
    type: String,
    maxlength: [200, 'Target audience cannot be more than 200 characters']
  },
  platform: {
    type: String,
    enum: ['Google Ads', 'Facebook Ads', 'Instagram Ads', 'LinkedIn Ads', 'Twitter Ads'],
    required: [true, 'Platform is required']
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  }
}, {
  timestamps: true
});

// Calculate CTR before saving
campaignSchema.pre('save', function(next) {
  if (this.impressions > 0) {
    this.ctr = (this.clicks / this.impressions) * 100;
  }
  
  if (this.clicks > 0) {
    this.cpc = this.spent / this.clicks;
  }
  
  next();
});

export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema); 