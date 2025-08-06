# ADmyBRAND Insights - Backend API

A robust Node.js/Express backend API for the ADmyBRAND Insights analytics dashboard with MongoDB, JWT authentication, and comprehensive analytics endpoints.

## 🚀 Features

### 🔐 Authentication & Security
- **JWT Authentication** with secure token management
- **Password Hashing** using bcryptjs
- **Role-based Authorization** (Admin/User)
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for frontend integration
- **Helmet Security** headers

### 📊 Analytics & Data
- **Real-time Metrics** calculation
- **Chart Data** endpoints for dashboard visualization
- **Campaign Management** with CRUD operations
- **Analytics Tracking** with historical data
- **Pagination** and filtering support

### 🛠️ Technical Stack
- **Node.js** with TypeScript
- **Express.js** framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Morgan** for request logging
- **Helmet** for security headers

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd admybrand-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update the `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/admybrand_insights

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

5. Start MongoDB (make sure MongoDB is running)

6. Seed the database with sample data:
```bash
npm run seed
```

7. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── config/
│   └── database.ts          # MongoDB connection
├── controllers/
│   ├── authController.ts     # Authentication logic
│   └── analyticsController.ts # Analytics endpoints
├── middleware/
│   ├── auth.ts              # JWT authentication
│   └── error.ts             # Error handling
├── models/
│   ├── User.ts              # User model
│   ├── Campaign.ts          # Campaign model
│   └── Analytics.ts         # Analytics model
├── routes/
│   ├── auth.ts              # Authentication routes
│   └── analytics.ts         # Analytics routes
├── utils/
│   └── seeder.ts            # Database seeder
└── index.ts                 # Main server file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - User logout (Protected)

### Analytics
- `GET /api/analytics/metrics` - Get dashboard metrics (Protected)
- `GET /api/analytics/charts` - Get chart data (Protected)
- `GET /api/analytics/campaigns` - Get campaigns with pagination (Protected)

### Health Check
- `GET /health` - API health status
- `GET /` - API welcome and documentation

## 📊 Database Models

### User Model
- Name, email, password (hashed)
- Role (admin/user)
- Avatar, last login
- Account status

### Campaign Model
- Campaign details (name, status, budget)
- Performance metrics (impressions, clicks, CTR, CPC)
- Revenue and conversion tracking
- Platform and targeting information

### Analytics Model
- Daily metrics (revenue, users, conversions)
- Traffic sources breakdown
- Device distribution data
- Growth rate calculations

## 🔐 Authentication

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@admybrand.com",
  "password": "password123"
}
```

### Protected Routes
Include the JWT token in the Authorization header:
```bash
Authorization: Bearer <your-jwt-token>
```

## 📈 Sample Data

The seeder creates:
- **Admin User**: admin@admybrand.com / password123
- **30 days of analytics data** with realistic metrics
- **6 sample campaigns** with different statuses and platforms

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Make sure to set these in production:
- `NODE_ENV=production`
- `MONGODB_URI` (your MongoDB connection string)
- `JWT_SECRET` (strong secret key)
- `CORS_ORIGIN` (your frontend URL)

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### API Testing
You can test the API using tools like:
- **Postman**
- **Insomnia**
- **curl**

Example health check:
```bash
curl http://localhost:5000/health
```

## 📊 API Response Format

All API responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔒 Security Features

- **JWT Token Authentication**
- **Password Hashing** with bcryptjs
- **Rate Limiting** to prevent abuse
- **CORS Protection**
- **Helmet Security Headers**
- **Input Validation** and sanitization
- **Error Handling** with proper HTTP status codes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

Built with ❤️ for ADmyBRAND Insights Backend 