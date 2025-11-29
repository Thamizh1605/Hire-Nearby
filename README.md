# Hire Nearby

A complete marketplace platform connecting Requesters (customers) with Providers (service workers) for local jobs like cleaning, cooking, and tutoring.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)

### Setup Steps

1. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   # Copy example env files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Edit backend/.env and set:
   # - MONGODB_URI (e.g., mongodb://localhost:27017/hire-nearby)
   # - JWT_SECRET (any random string)
   # - NODE_ENV=development
   # - PORT=5000
   # - FRONTEND_URL=http://localhost:5173
   ```

3. **Start MongoDB** (if running locally):
   ```bash
   # macOS with Homebrew:
   brew services start mongodb-community
   
   # Or use MongoDB Atlas connection string in .env
   ```

4. **Seed the database:**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

6. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:5173
   ```

7. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## 📋 Verification Checklist

Run these steps to verify the app works:

1. ✅ **Register a new user** (Requester role)
   - Go to http://localhost:5173/register
   - Fill: Name, Email, Password, Role: Requester, City
   - Submit and login

2. ✅ **Post a job** (as Requester)
   - Go to Dashboard → "Post New Job"
   - Fill: Category, Date, Time, Duration, City (or use geolocation)
   - Submit

3. ✅ **Login as Provider**
   - Use seeded provider: `provider1@test.com` / `password123`
   - Or register new provider

4. ✅ **Browse jobs** (as Provider)
   - Go to Dashboard → Browse Jobs
   - Set search radius, filters, sort options
   - View job details

5. ✅ **Make an offer** (as Provider)
   - Open a job detail page
   - Click "Make Offer"
   - Enter hourly rate, message, availability window
   - Submit

6. ✅ **Accept offer** (as Requester)
   - Go to Dashboard → View Offers
   - Accept an offer (creates booking)

7. ✅ **Start & Complete booking** (as Provider)
   - Go to Dashboard → My Bookings
   - Click "Start Job" then "Mark Complete"

8. ✅ **Pay** (as Requester)
   - After job completed, go to Dashboard → Bookings
   - Click "Pay" → Enter amount → Click "Paid"

9. ✅ **Review** (as Requester)
   - After payment, rate and review the provider

10. ✅ **Chat** (Requester ↔ Provider)
    - Open a booking detail page
    - Send messages, see typing indicators

## 🏗️ Project Structure

```
hire-nearby/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── middleware/      # Auth, error handling
│   ├── utils/           # Helpers (distance, email, etc.)
│   ├── server.js        # Express app entry
│   ├── seed.js          # Database seed script
│   └── tests/           # Backend tests
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   ├── context/     # React context (auth)
│   │   └── App.jsx      # Main app
│   └── public/
├── docker-compose.yml   # Docker setup
└── README.md
```

## 🔐 Privacy & Data

**We respect your privacy:**
- ✅ We store: Name, Email, City, Approximate location (lat/lng rounded to 3 decimals)
- ✅ Passwords are hashed (bcrypt)
- ❌ We do NOT store: Phone numbers, National ID, Exact street addresses, or other personal data

See `/privacy` page in the app for details.

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🐳 Docker (Optional)

Run MongoDB + Backend with Docker:

```bash
docker-compose up -d
```

## 📦 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `cd frontend && npm install && npm run build`
4. Set output directory: `frontend/dist`
5. Add environment variable: `VITE_API_URL=https://your-backend-url.com`

### Backend (Render/Railway)
1. Connect GitHub repo
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend-url.vercel.app`
   - `PORT` (auto-set by platform)

See `DEPLOYMENT.md` for detailed instructions.

## 📝 API Documentation

See `backend/postman_collection.json` or use the provided Postman collection.

## 🔮 Future Improvements

See `TODO.md` for planned enhancements.

## 📄 License

MIT

