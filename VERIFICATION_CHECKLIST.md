# Verification Checklist

Use this checklist to verify all features work correctly after setup.

## Setup Verification

- [ ] MongoDB is running (local or Atlas)
- [ ] Backend server starts on port 5000
- [ ] Frontend dev server starts on port 5173
- [ ] Database seeded successfully

## Authentication Flow

- [ ] **Register new Requester**
  - Go to `/register`
  - Fill form: Name, Email, Password, Role: Requester, City
  - Submit → Should redirect to home and show logged in state

- [ ] **Register new Provider**
  - Logout
  - Go to `/register`
  - Fill form: Name, Email, Password, Role: Provider, City
  - Submit → Should redirect to home

- [ ] **Login**
  - Use seeded account: `provider1@test.com` / `password123`
  - Should login successfully

- [ ] **Logout**
  - Click logout → Should redirect to home, show login button

## Requester Flow

- [ ] **Post a Job**
  - Login as requester
  - Go to Dashboard → "Post New Job"
  - Fill: Title, Description, Category (cleaning/cooking/tutoring), Date, Time, Duration, City
  - Optionally use geolocation
  - Submit → Job should appear in "My Jobs" tab

- [ ] **View Offers**
  - After provider makes offer, go to job detail page
  - Should see offer with provider name, rate, message
  - Offer status should be "pending"

- [ ] **Accept Offer**
  - Click "Accept Offer" on an offer
  - Should create booking
  - Job status should change to "booked"
  - Booking should appear in "Bookings" tab

- [ ] **Pay for Completed Job**
  - After provider marks job complete
  - Go to Bookings → Find completed booking
  - Click "Pay Now"
  - Enter amount → Click Paid
  - Payment status should change to "paid"

- [ ] **Review Provider**
  - After payment, booking detail page should show review form
  - Submit rating (1-5) and comment
  - Review should be saved
  - Provider rating should update

## Provider Flow

- [ ] **Browse Jobs**
  - Login as provider
  - Go to Dashboard → "Browse Jobs" (or `/browse`)
  - Should see list of open jobs
  - Filters should work: category, city, radius, sort, max price, date

- [ ] **View Job Details**
  - Click on a job card
  - Should see full job details
  - Should see "Make Offer" button

- [ ] **Make Offer**
  - Click "Make Offer"
  - Fill: Hourly Rate, Message, Availability Start/End
  - Submit → Should show success message
  - Offer should appear in requester's job detail page

- [ ] **View Bookings**
  - After offer accepted, go to Dashboard → "My Bookings"
  - Should see booking with status "accepted"

- [ ] **Start Job**
  - Click "Start Job" on accepted booking
  - Status should change to "in_progress"
  - Requester should receive notification (check console logs)

- [ ] **Complete Job**
  - Click "Mark Complete" on in-progress booking
  - Status should change to "completed"
  - Requester should receive notification

- [ ] **Earnings Dashboard**
  - After payment, check earnings section
  - Total earnings and monthly earnings should update

## Chat Feature

- [ ] **Send Messages**
  - Open booking detail page (as requester or provider)
  - Type message and send
  - Message should appear in chat
  - Other user should see message (test in two browsers)

- [ ] **Typing Indicator**
  - Start typing → Other user should see "X is typing..."
  - Stop typing → Indicator should disappear after 3 seconds

- [ ] **Read Receipts**
  - Sent messages should show ✓✓ when read by recipient

## Admin Panel

- [ ] **Access Admin Panel**
  - Login as admin: `admin@test.com` / `admin123`
  - Go to `/dashboard/admin`
  - Should see Users and Jobs tabs

- [ ] **View Users**
  - Click Users tab
  - Should see list of all users
  - Should see name, email, role, city

- [ ] **View Jobs**
  - Click Jobs tab
  - Should see list of all jobs
  - Should see job details

- [ ] **Delete User/Job**
  - Click Delete on a user or job
  - Confirm deletion
  - Item should be removed from list

## Privacy Features

- [ ] **Privacy Page**
  - Go to `/privacy`
  - Should explain what data is stored
  - Should state no phone numbers or addresses stored

- [ ] **Location Rounding**
  - Check database: lat/lng should be rounded to 3 decimals
  - Example: 37.7749 not 37.774912345

## Search & Filters

- [ ] **Distance Search**
  - As provider, set search radius (e.g., 10km)
  - Jobs should be filtered by distance
  - Distance should be shown on job cards

- [ ] **Category Filter**
  - Select category (cleaning/cooking/tutoring)
  - Only jobs in that category should show

- [ ] **Sort Options**
  - Test sorting by: distance, rating, price, availability
  - Results should reorder correctly

## Error Handling

- [ ] **Invalid Login**
  - Try login with wrong password
  - Should show error message

- [ ] **Unauthorized Access**
  - Try to access `/dashboard/admin` as non-admin
  - Should redirect or show error

- [ ] **Missing Fields**
  - Try to submit forms with missing required fields
  - Should show validation errors

## All Tests Pass

- [ ] **Backend Tests**
  ```bash
  cd backend
  npm test
  ```
  - All tests should pass

- [ ] **Frontend Tests**
  ```bash
  cd frontend
  npm test
  ```
  - All tests should pass

## Final Checklist

- [ ] All features work as expected
- [ ] No console errors in browser
- [ ] No errors in backend logs
- [ ] Database queries are efficient
- [ ] UI is responsive (test on mobile viewport)
- [ ] All routes are protected correctly
- [ ] Email notifications logged to console (or sent via SMTP)

## Quick Test Commands

```bash
# 1. Start MongoDB (if local)
brew services start mongodb-community

# 2. Seed database
cd backend && npm run seed

# 3. Start backend
cd backend && npm run dev

# 4. Start frontend (new terminal)
cd frontend && npm run dev

# 5. Run tests
cd backend && npm test
cd frontend && npm test
```

## Test Accounts (from seed)

- **Admin**: `admin@test.com` / `admin123`
- **Requester**: `requester@test.com` / `password123`
- **Provider 1**: `provider1@test.com` / `password123`
- **Provider 2**: `provider2@test.com` / `password123`

