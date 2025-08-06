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
exports.Analytics = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const analyticsSchema = new mongoose_1.Schema({
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
analyticsSchema.index({ date: 1 });
exports.Analytics = mongoose_1.default.model('Analytics', analyticsSchema);
//# sourceMappingURL=Analytics.js.map