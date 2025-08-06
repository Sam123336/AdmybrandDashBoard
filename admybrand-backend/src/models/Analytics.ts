import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  date: Date;
  revenue: number;
  users: number;
  conversions: number;
  growthRate: number;
  trafficSources: {
    socialMedia: number;
    email: number;
    direct: number;
    referral: number;
    organic: number;
    paid: number;
  };
  deviceDistribution: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>({
  date: {
    type: Date,
    required: [true, 'Date is required'],
    unique: true
  },
  revenue: {
    type: Number,
    required: [true, 'Revenue is required'],
    min: [0, 'Revenue cannot be negative']
  },
  users: {
    type: Number,
    required: [true, 'Users count is required'],
    min: [0, 'Users cannot be negative']
  },
  conversions: {
    type: Number,
    required: [true, 'Conversions count is required'],
    min: [0, 'Conversions cannot be negative']
  },
  growthRate: {
    type: Number,
    required: [true, 'Growth rate is required'],
    min: [-100, 'Growth rate cannot be less than -100%'],
    max: [1000, 'Growth rate cannot exceed 1000%']
  },
  trafficSources: {
    socialMedia: {
      type: Number,
      default: 0,
      min: [0, 'Social media traffic cannot be negative']
    },
    email: {
      type: Number,
      default: 0,
      min: [0, 'Email traffic cannot be negative']
    },
    direct: {
      type: Number,
      default: 0,
      min: [0, 'Direct traffic cannot be negative']
    },
    referral: {
      type: Number,
      default: 0,
      min: [0, 'Referral traffic cannot be negative']
    },
    organic: {
      type: Number,
      default: 0,
      min: [0, 'Organic traffic cannot be negative']
    },
    paid: {
      type: Number,
      default: 0,
      min: [0, 'Paid traffic cannot be negative']
    }
  },
  deviceDistribution: {
    desktop: {
      type: Number,
      default: 0,
      min: [0, 'Desktop users cannot be negative']
    },
    mobile: {
      type: Number,
      default: 0,
      min: [0, 'Mobile users cannot be negative']
    },
    tablet: {
      type: Number,
      default: 0,
      min: [0, 'Tablet users cannot be negative']
    }
  }
}, {
  timestamps: true
});

// Create index for date queries
analyticsSchema.index({ date: 1 });

export const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema); 