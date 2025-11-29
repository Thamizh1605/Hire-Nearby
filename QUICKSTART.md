# Quick Start Guide

## One-Time Setup

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install

# 3. Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Edit backend/.env:
#    MONGODB_URI=mongodb://localhost:27017/hire-nearby
#    JWT_SECRET=your-secret-key-here
#    NODE_ENV=development
#    PORT=5000
#    FRONTEND_URL=http://localhost:5173

# 5. Start MongoDB (if local)
# macOS: brew services start mongodb-community
# Or use MongoDB Atlas connection string

# 6. Seed the database
cd backend
npm run seed
```

## Running the App

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Test Accounts (from seed)

- Admin: `admin@test.com` / `admin123`
- Requester: `requester@test.com` / `password123`
- Provider 1: `provider1@test.com` / `password123`
- Provider 2: `provider2@test.com` / `password123`

## Quick Test Flow

1. **Login as Requester** → `requester@test.com` / `password123`
2. **Post a Job** → Dashboard → Post New Job
3. **Login as Provider** → `provider1@test.com` / `password123`
4. **Browse Jobs** → Dashboard → Browse Jobs
5. **Make Offer** → Click job → Make Offer
6. **Login as Requester** → Accept offer
7. **Login as Provider** → Start job → Complete job
8. **Login as Requester** → Pay → Review

## Docker Alternative

```bash
# Start MongoDB + Backend with Docker
docker-compose up -d

# Then start frontend separately
cd frontend
npm run dev
```

## Troubleshooting

- **MongoDB connection error**: Ensure MongoDB is running or check connection string
- **Port already in use**: Change PORT in backend/.env
- **CORS errors**: Check FRONTEND_URL in backend/.env matches frontend URL
- **Module not found**: Run `npm install` in both backend and frontend

## Next Steps

See `VERIFICATION_CHECKLIST.md` for comprehensive testing guide.
See `DEPLOYMENT.md` for production deployment instructions.

