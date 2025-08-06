import mongoose, { Document } from 'mongoose';
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
export declare const Analytics: mongoose.Model<IAnalytics, {}, {}, {}, mongoose.Document<unknown, {}, IAnalytics> & IAnalytics & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Analytics.d.ts.map