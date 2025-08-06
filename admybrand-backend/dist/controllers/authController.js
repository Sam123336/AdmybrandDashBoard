"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = exports.updateProfile = exports.logout = exports.getMe = exports.login = exports.register = void 0;
const jwt = require('jsonwebtoken');
const User_1 = require("../models/User");
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    return jwt.sign({ id }, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User_1.User.findOne({ email });
        if (userExists) {
            res.status(400).json({
                success: false,
                message: 'User already exists'
            });
            return;
        }
        const user = await User_1.User.create({
            name,
            email,
            password,
            role: role || 'user'
        });
        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                },
                token: generateToken(user._id.toString())
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        user.lastLogin = new Date();
        await user.save();
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                lastLogin: user.lastLogin
            },
            token: generateToken(user._id.toString())
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user?._id);
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
exports.getMe = getMe;
const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};
exports.logout = logout;
const updateProfile = async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
            return;
        }
        const userId = req.user._id;
        const user = await User_1.User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        if (currentPassword && newPassword) {
            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
                return;
            }
            user.password = newPassword;
        }
        await user.save();
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt
            },
            message: 'Profile updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
exports.updateProfile = updateProfile;
const getSettings = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
            return;
        }
        const userId = req.user._id;
        const user = await User_1.User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
exports.getSettings = getSettings;
//# sourceMappingURL=authController.js.map