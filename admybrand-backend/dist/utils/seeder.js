"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const Analytics_1 = require("../models/Analytics");
const Campaign_1 = require("../models/Campaign");
const database_1 = require("../config/database");
const seedData = async () => {
    try {
        await (0, database_1.connectDB)();
        await User_1.User.deleteMany({});
        await Analytics_1.Analytics.deleteMany({});
        await Campaign_1.Campaign.deleteMany({});
        console.log('🗑️  Cleared existing data');
        const adminUser = await User_1.User.create({
            name: 'Admin User',
            email: 'admin@admybrand.com',
            password: 'password123',
            role: 'admin',
            avatar: '/avatars/01.png'
        });
        const regularUser = await User_1.User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user',
            avatar: '/avatars/02.png'
        });
        console.log('👤 Created admin and regular users');
        const analyticsData = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const baseRevenue = 4000 + Math.random() * 2000;
            const baseUsers = 2000 + Math.random() * 1000;
            const baseConversions = 2000 + Math.random() * 500;
            analyticsData.push({
                date,
                revenue: Math.round(baseRevenue),
                users: Math.round(baseUsers),
                conversions: Math.round(baseConversions),
                growthRate: 5 + Math.random() * 10,
                trafficSources: {
                    socialMedia: Math.round(300 + Math.random() * 200),
                    email: Math.round(200 + Math.random() * 150),
                    direct: Math.round(250 + Math.random() * 100),
                    referral: Math.round(150 + Math.random() * 100),
                    organic: Math.round(250 + Math.random() * 150),
                    paid: Math.round(150 + Math.random() * 100)
                },
                deviceDistribution: {
                    desktop: Math.round(400 + Math.random() * 200),
                    mobile: Math.round(300 + Math.random() * 150),
                    tablet: Math.round(200 + Math.random() * 100)
                }
            });
        }
        await Analytics_1.Analytics.insertMany(analyticsData);
        console.log('📊 Created analytics data');
        const campaigns = [
            {
                name: 'Summer Sale 2024',
                status: 'Active',
                budget: 5000,
                spent: 3200,
                impressions: 125000,
                clicks: 12500,
                ctr: 10.0,
                cpc: 0.25,
                conversions: 1250,
                revenue: 12500,
                startDate: new Date('2024-06-01'),
                description: 'Summer promotion campaign',
                targetAudience: 'Young adults 18-35',
                platform: 'Google Ads',
                createdBy: adminUser._id
            },
            {
                name: 'Brand Awareness Q1',
                status: 'Paused',
                budget: 10000,
                spent: 8500,
                impressions: 250000,
                clicks: 15000,
                ctr: 6.0,
                cpc: 0.57,
                conversions: 750,
                revenue: 7500,
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-03-31'),
                description: 'Q1 brand awareness campaign',
                targetAudience: 'General audience',
                platform: 'Facebook Ads',
                createdBy: adminUser._id
            },
            {
                name: 'Personal Campaign',
                status: 'Draft',
                budget: 3000,
                spent: 0,
                impressions: 0,
                clicks: 0,
                ctr: 0,
                cpc: 0,
                conversions: 0,
                revenue: 0,
                startDate: new Date('2024-07-01'),
                description: 'My first campaign request',
                targetAudience: 'Local customers',
                platform: 'Google Ads',
                createdBy: regularUser._id
            },
            {
                name: 'Product Launch',
                status: 'Active',
                budget: 15000,
                spent: 12000,
                impressions: 300000,
                clicks: 25000,
                ctr: 8.3,
                cpc: 0.48,
                conversions: 2000,
                revenue: 20000,
                startDate: new Date('2024-05-15'),
                description: 'New product launch campaign',
                targetAudience: 'Tech enthusiasts',
                platform: 'Instagram Ads',
                createdBy: adminUser._id
            },
            {
                name: 'Holiday Special',
                status: 'Completed',
                budget: 8000,
                spent: 8000,
                impressions: 180000,
                clicks: 18000,
                ctr: 10.0,
                cpc: 0.44,
                conversions: 1800,
                revenue: 18000,
                startDate: new Date('2023-12-01'),
                endDate: new Date('2023-12-31'),
                description: 'Holiday season campaign',
                targetAudience: 'All demographics',
                platform: 'LinkedIn Ads',
                createdBy: adminUser._id
            },
            {
                name: 'Retargeting Campaign',
                status: 'Active',
                budget: 6000,
                spent: 4500,
                impressions: 90000,
                clicks: 9000,
                ctr: 10.0,
                cpc: 0.50,
                conversions: 900,
                revenue: 9000,
                startDate: new Date('2024-06-15'),
                description: 'Retargeting existing customers',
                targetAudience: 'Previous customers',
                platform: 'Google Ads',
                createdBy: adminUser._id
            },
            {
                name: 'Influencer Partnership',
                status: 'Active',
                budget: 12000,
                spent: 9000,
                impressions: 200000,
                clicks: 20000,
                ctr: 10.0,
                cpc: 0.45,
                conversions: 2000,
                revenue: 20000,
                startDate: new Date('2024-06-01'),
                description: 'Influencer collaboration campaign',
                targetAudience: 'Social media followers',
                platform: 'Instagram Ads',
                createdBy: adminUser._id
            }
        ];
        await Campaign_1.Campaign.insertMany(campaigns);
        console.log('📈 Created campaign data');
        console.log('✅ Database seeded successfully!');
        console.log('🔑 Login credentials:');
        console.log('   Admin - Email: admin@admybrand.com, Password: password123');
        console.log('   User - Email: john@example.com, Password: password123');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};
if (require.main === module) {
    seedData();
}
exports.default = seedData;
//# sourceMappingURL=seeder.js.map