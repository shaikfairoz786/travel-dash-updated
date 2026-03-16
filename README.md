# TravelTemplate - Full-Stack Application Setup Guide

Welcome to the TravelTemplate source code! Follow these steps to get the app running on your local machine.

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL Database (Local or Neon.tech)
- Cloudinary Account (for image uploads)
- Stripe Account (for payments)

## 1. Backend Setup
1. Open your terminal and navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the backend folder and add the following:
   ```env
   PORT=5000
   DATABASE_URL="your_postgresql_connection_string"
   JWT_SECRET="any_random_long_string"
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   STRIPE_SECRET_KEY="your_stripe_secret"
   ```
4. Push the Prisma Schema to your database: `npx prisma db push`
5. Start the backend server: `npm run dev` (Runs on http://localhost:5000)

## 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the frontend folder:
   ```env
   VITE_API_BASE_URL="http://localhost:5000"
   VITE_STRIPE_PUBLIC_KEY="your_stripe_public_key"
   ```
4. Start the frontend server: `npm run dev` (Runs on http://localhost:5173)

## 3. Creating an Admin Account
To access the Admin Dashboard (`/admin`), you need to manually change a user's role in your database:
1. Register a normal account on the frontend.
2. Open your database (or run `npx prisma studio` in the backend folder).
3. Find your user record and change the `role` from `"customer"` to `"admin"`.
4. Log out and log back in. You will now see the Admin Panel!
