import mongoose, { Document } from 'mongoose';
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
export declare const Campaign: mongoose.Model<ICampaign, {}, {}, {}, mongoose.Document<unknown, {}, ICampaign> & ICampaign & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Campaign.d.ts.map