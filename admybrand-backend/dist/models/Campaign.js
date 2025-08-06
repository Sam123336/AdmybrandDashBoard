"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campaign = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const campaignSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Created by is required']
    }
}, {
    timestamps: true
});
campaignSchema.pre('save', function (next) {
    if (this.impressions > 0) {
        this.ctr = (this.clicks / this.impressions) * 100;
    }
    if (this.clicks > 0) {
        this.cpc = this.spent / this.clicks;
    }
    next();
});
exports.Campaign = mongoose_1.default.model('Campaign', campaignSchema);
//# sourceMappingURL=Campaign.js.map