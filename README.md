# ADmyBRAND Insights Dashboard

A comprehensive analytics and campaign management dashboard with user authentication and role-based access control.

## Features

### 🔐 User Authentication & Authorization
- **User Login/Registration**: Secure authentication system with JWT tokens
- **Role-Based Access**: Admin and User roles with different permissions
- **Session Management**: Automatic token refresh and session handling

### 📊 Analytics Dashboard
- **Real-time Metrics**: Revenue, users, conversions, and growth tracking
- **Interactive Charts**: Line charts, bar charts, and pie charts for data visualization
- **Performance Analytics**: Traffic sources, device distribution, and conversion tracking

### 🎯 Campaign Management
- **User Campaigns**: Users can request new campaigns and view their existing ones
- **Campaign Metrics**: Track Budget, Spent, Impressions, Clicks, CTR, CPC, Conversions, and Revenue
- **Status Management**: Draft, Active, Paused, and Completed campaign states
- **Platform Support**: Google Ads, Facebook Ads, Instagram Ads, LinkedIn Ads, Twitter Ads

### 👨‍💼 Admin Panel
- **User Management**: View, edit, and manage all users
- **Campaign Oversight**: Monitor all campaigns across the platform
- **Dashboard Analytics**: Comprehensive overview of platform metrics
- **Campaign Approval**: Review and approve user campaign requests

## Tech Stack

### Backend
- **Node.js** with TypeScript
- **Express.js** for API framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AiDashBoard
   ```

2. **Install backend dependencies**
   ```bash
   cd admybrand-backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../admybrand-dashboard
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in `admybrand-backend`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/admybrand
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Database Setup**
   ```bash
   cd admybrand-backend
   npm run seed
   ```

6. **Start the servers**

   Backend:
   ```bash
   cd admybrand-backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd admybrand-dashboard
   npm start
   ```

## Usage

### User Roles

#### Regular User
- View analytics dashboard
- Request new campaigns
- View and manage their own campaigns
- Track campaign performance metrics

#### Admin User
- All user permissions
- View all campaigns across the platform
- Manage user accounts
- Approve/reject campaign requests
- Update campaign metrics
- Access comprehensive admin dashboard

### Login Credentials

After running the seeder, you can login with:

**Admin Account:**
- Email: `admin@admybrand.com`
- Password: `password123`

**Regular User Account:**
- Email: `john@example.com`
- Password: `password123`

### Campaign Management

#### For Users
1. Navigate to "My Campaigns" tab
2. Click "Request New Campaign" to create a campaign request
3. Fill in campaign details (name, budget, platform, etc.)
4. Submit request (status will be "Draft" initially)
5. View campaign metrics and status updates

#### For Admins
1. Navigate to "Admin Panel" tab
2. View all campaigns in the "Campaigns" section
3. Approve/reject campaign requests
4. Update campaign metrics
5. Manage user accounts in the "Users" section

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Analytics
- `GET /api/analytics/metrics` - Get dashboard metrics
- `GET /api/analytics/charts` - Get chart data
- `GET /api/analytics/campaigns` - Get campaigns data

### Campaigns
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/my-campaigns` - Get user's campaigns
- `GET /api/campaigns/all` - Get all campaigns (Admin)
- `PUT /api/campaigns/:id/status` - Update campaign status (Admin)
- `PUT /api/campaigns/:id/metrics` - Update campaign metrics (Admin)
- `GET /api/campaigns/:id` - Get campaign by ID
- `DELETE /api/campaigns/:id` - Delete campaign

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/campaign-requests` - Get campaign requests

## Project Structure

```
AiDashBoard/
├── admybrand-backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── analyticsController.ts
│   │   │   ├── authController.ts
│   │   │   ├── campaignController.ts
│   │   │   └── adminController.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Campaign.ts
│   │   │   └── Analytics.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── analytics.ts
│   │   │   ├── campaigns.ts
│   │   │   └── admin.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── admin.ts
│   │   │   └── error.ts
│   │   └── utils/
│   │       └── seeder.ts
│   └── package.json
└── admybrand-dashboard/
    ├── src/
    │   ├── components/
    │   │   ├── dashboard.tsx
    │   │   ├── campaign-management.tsx
    │   │   ├── admin-dashboard.tsx
    │   │   └── ui/
    │   ├── contexts/
    │   │   ├── AuthContext.tsx
    │   │   └── AnalyticsContext.tsx
    │   ├── services/
    │   │   ├── auth.ts
    │   │   ├── analytics.ts
    │   │   ├── campaigns.ts
    │   │   └── admin.ts
    │   └── App.tsx
    └── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. # AdmybrandDashBoard
# AdmybrandDashBoard
# AdmybrandDashBoard
