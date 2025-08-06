"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const error_1 = require("./middleware/error");
const auth_1 = __importDefault(require("./routes/auth"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const campaigns_1 = __importDefault(require("./routes/campaigns"));
const admin_1 = __importDefault(require("./routes/admin"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, database_1.connectDB)();
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api/', limiter);
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'ADmyBRAND Insights API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/analytics', analytics_1.default);
app.use('/api/campaigns', campaigns_1.default);
app.use('/api/admin', admin_1.default);
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to ADmyBRAND Insights API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            analytics: '/api/analytics',
            campaigns: '/api/campaigns',
            admin: '/api/admin',
            health: '/health'
        }
    });
});
app.use(error_1.notFound);
app.use(error_1.errorHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/`);
});
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    server.close(() => {
        process.exit(1);
    });
});
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    server.close(() => {
        process.exit(1);
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map