# 🚀 StudyHub Deployment Guide

## 1. Features
- Drag & drop/share study files (PDF, PPT, images, txt, zip)
- Real-time listing/search with React + Shadcn UI
- **Cloudflare R2** Storage (S3-compatible, cheaper than AWS)
- Free Firebase Firestore for metadata

## 2. Prerequisites
- **Firebase Project:** Firestore & Anonymous Auth enabled
- **Cloudflare R2 Bucket:**
  - Create a bucket
  - Create API Tokens (Edit permission)
  - Enable Public Access (Custom Domain or R2.dev subdomain)
- **Vercel/Render/Railway** account for hosting

## 3. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database**
3. Enable **Authentication** → **Anonymous**
4. Set **Firestore Rules** (Security):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /materials/{id} {
         allow read: if true;
         allow create: if true; // Or restrict to auth users
         allow update, delete: if false;
       }
     }
   }
   ```

## 4. Cloudflare R2 Setup
1. Go to Cloudflare Dashboard > R2
2. Create a bucket (e.g., `studyhub-files`)
3. Go to "Manage R2 API Tokens" -> Create Token
   - Permission: **Object Read & Write**
   - Copy: `Access Key ID`, `Secret Access Key`, `Account ID`
4. Go to Bucket Settings -> Public Access -> Enable Public Access
   - Copy the **Public Bucket URL**

## 5. Deployment (Render.com Recommended)
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. **Settings:**
   - **Runtime:** Node
   - **Build Command:** `npm run build` (This will run `cd frontend && npm run build`)
   - **Start Command:** `npm start` (This will run `node server.js`)
4. **Environment Variables:**
   Add these in the Render Dashboard:
   ```env
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=your_bucket_name
   R2_PUBLIC_URL=https://your-bucket-url.r2.dev
   ADMIN_PASSWORD=your_secret_password
   ```
5. Deploy!

## 6. Deployment (Vercel)
*Note: Vercel is optimized for frontend. For this full-stack app, Render is easier.*
1. Import your repo to Vercel
2. **Build Settings:**
   - Framework Preset: **Other**
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install`
3. **Environment Variables:** (Same as above)


## 6. Local Development
1. `npm install`
2. Create `.env` with the R2 credentials above.
3. Run `npm start`
4. Visit `http://localhost:3001`
