# Deployment Guide

This guide explains how to deploy the ProU Assignment application.

## 1. Backend Deployment (Render)

1.  **Create a Render Account**: Go to [render.com](https://render.com/) and sign up.
2.  **New Web Service**: Click "New +" and select "Web Service".
3.  **Connect GitHub**: Connect your GitHub repository.
4.  **Configure Service**:
    -   **Name**: `prou-backend` (or similar)
    -   **Root Directory**: `server`
    -   **Runtime**: Node
    -   **Build Command**: `npm install && npx prisma generate`
    -   **Start Command**: `npm start`
5.  **Environment Variables**:
    -   Add the following environment variables in the "Environment" tab:
        -   `DATABASE_URL`: Your MongoDB connection string (e.g., from MongoDB Atlas).
        -   `JWT_SECRET`: A strong secret key for JWT.
        -   `CLIENT_URL`: The URL of your frontend (you will get this after deploying frontend, or use `*` initially).
6.  **Deploy**: Click "Create Web Service".
7.  **Copy URL**: Once deployed, copy the backend URL (e.g., `https://prou-backend.onrender.com`).
The `JWT_SECRET` is an environment variable you configured during backend deployment on Render. You can find its value in your Render dashboard under the environment variables for your `prou-backend` service.

## 2. Frontend Deployment (Vercel)

1.  **Create a Vercel Account**: Go to [vercel.com](https://vercel.com/) and sign up.
2.  **Add New Project**: Click "Add New..." -> "Project".
3.  **Import Repository**: Import your GitHub repository.
4.  **Configure Project**:
    -   **Root Directory**: `client` (Click "Edit" next to Root Directory and select `client`).
    -   **Framework Preset**: Vite (should be auto-detected).
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist`
5.  **Environment Variables**:
    -   Add the following environment variable:
        -   `VITE_API_URL`: The URL of your deployed backend (e.g., `https://prou-backend.onrender.com/api`). **Note: Append `/api` at the end.**
6.  **Deploy**: Click "Deploy".

## 3. Final Configuration

1.  **Update Backend CORS**:
    -   Go back to your Render dashboard.
    -   Update the `CLIENT_URL` environment variable to your new Vercel frontend URL (e.g., `https://prou-frontend.vercel.app`).
    -   Render will automatically redeploy.

## 4. Database Seeding (Optional)

If you want to seed your production database:
1.  Go to the Render dashboard for your backend service.
2.  Click "Shell" to open a terminal.
3.  Run: `npm run prisma:seed` (Ensure you added the script to package.json) or `node prisma/seed.js`.
