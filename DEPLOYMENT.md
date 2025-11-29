# Deployment Instructions

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
1. Ensure `frontend/.env.production` or build-time env vars are set:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

### Step 2: Deploy to Vercel
1. **Via Vercel CLI:**
   ```bash
   cd frontend
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Via Vercel Dashboard:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Root Directory:** `frontend`
     - **Build Command:** `npm install && npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`
   - Add Environment Variable:
     - `VITE_API_URL` = `https://your-backend-url.com`
   - Click "Deploy"

### Step 3: Update Backend CORS
Update `backend/.env` with your Vercel frontend URL:
```
FRONTEND_URL=https://your-app.vercel.app
```

## Backend Deployment (Render)

### Step 1: Prepare Backend
1. Create a MongoDB Atlas cluster (free tier available)
2. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/hire-nearby`

### Step 2: Deploy to Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `hire-nearby-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free (or paid)
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hire-nearby
   JWT_SECRET=your-secret-key-here
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   PORT=10000
   ```
6. Click "Create Web Service"
7. Note the service URL (e.g., `https://hire-nearby-backend.onrender.com`)

### Step 3: Update Frontend
Update `frontend/.env.production`:
```
VITE_API_URL=https://hire-nearby-backend.onrender.com
```

## Backend Deployment (Railway)

### Step 1: Prepare Backend
Same as Render - ensure MongoDB Atlas is set up.

### Step 2: Deploy to Railway
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add service → Select "Empty Service"
5. Configure:
   - **Root Directory:** `backend`
   - Railway will auto-detect Node.js
6. Add Environment Variables (in Variables tab):
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hire-nearby
   JWT_SECRET=your-secret-key-here
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```
7. Railway auto-generates a public URL
8. Update frontend `VITE_API_URL` with Railway URL

## Backend as Serverless (Vercel Functions - Optional)

If you want to deploy backend to Vercel as serverless functions:

1. Create `vercel.json` in root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "backend/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "backend/server.js"
       }
     ]
   }
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Note: Socket.IO may not work well with serverless. Use polling fallback.

## Post-Deployment Checklist

- [ ] Test API endpoints (use Postman collection)
- [ ] Verify CORS allows frontend domain
- [ ] Test authentication flow
- [ ] Seed production database (optional, via admin panel)
- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (optional)

## Environment Variables Summary

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/hire-nearby
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
SMTP_HOST= (optional, for real emails)
SMTP_PORT= (optional)
SMTP_USER= (optional)
SMTP_PASS= (optional)
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

