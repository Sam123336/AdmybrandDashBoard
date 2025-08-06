import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admybrand_insights';

// Simple in-memory storage for development
const dataPath = path.join(__dirname, '../../data');
const usersFile = path.join(dataPath, 'users.json');
const analyticsFile = path.join(dataPath, 'analytics.json');
const campaignsFile = path.join(dataPath, 'campaigns.json');

// Ensure data directory exists
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

// Initialize empty files if they don't exist
const initializeFile = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
};

initializeFile(usersFile);
initializeFile(analyticsFile);
initializeFile(campaignsFile);

export const connectDB = async (): Promise<void> => {
  try {
    // Try to connect to MongoDB first
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.log('⚠️  MongoDB connection failed, using in-memory storage for development');
    console.log('📁 Data will be stored in:', dataPath);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('✅ MongoDB disconnected successfully');
    }
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
};

// Helper functions for file-based storage
export const readData = (filePath: string): any[] => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const writeData = (filePath: string, data: any[]): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const getDataPath = () => dataPath;
export const getUsersFile = () => usersFile;
export const getAnalyticsFile = () => analyticsFile;
export const getCampaignsFile = () => campaignsFile; 