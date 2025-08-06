"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCampaignsFile = exports.getAnalyticsFile = exports.getUsersFile = exports.getDataPath = exports.writeData = exports.readData = exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admybrand_insights';
const dataPath = path_1.default.join(__dirname, '../../data');
const usersFile = path_1.default.join(dataPath, 'users.json');
const analyticsFile = path_1.default.join(dataPath, 'analytics.json');
const campaignsFile = path_1.default.join(dataPath, 'campaigns.json');
if (!fs_1.default.existsSync(dataPath)) {
    fs_1.default.mkdirSync(dataPath, { recursive: true });
}
const initializeFile = (filePath) => {
    if (!fs_1.default.existsSync(filePath)) {
        fs_1.default.writeFileSync(filePath, JSON.stringify([]));
    }
};
initializeFile(usersFile);
initializeFile(analyticsFile);
initializeFile(campaignsFile);
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    }
    catch (error) {
        console.log('⚠️  MongoDB connection failed, using in-memory storage for development');
        console.log('📁 Data will be stored in:', dataPath);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        if (mongoose_1.default.connection.readyState !== 0) {
            await mongoose_1.default.disconnect();
            console.log('✅ MongoDB disconnected successfully');
        }
    }
    catch (error) {
        console.error('❌ MongoDB disconnection error:', error);
    }
};
exports.disconnectDB = disconnectDB;
const readData = (filePath) => {
    try {
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        return [];
    }
};
exports.readData = readData;
const writeData = (filePath, data) => {
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
exports.writeData = writeData;
const getDataPath = () => dataPath;
exports.getDataPath = getDataPath;
const getUsersFile = () => usersFile;
exports.getUsersFile = getUsersFile;
const getAnalyticsFile = () => analyticsFile;
exports.getAnalyticsFile = getAnalyticsFile;
const getCampaignsFile = () => campaignsFile;
exports.getCampaignsFile = getCampaignsFile;
//# sourceMappingURL=database.js.map