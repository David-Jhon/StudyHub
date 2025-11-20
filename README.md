# StudyHub

Share. Learn. Grow. – A modern file sharing portal for classes, study groups, and learning communities.

## Features
- ☁️ Drag-and-drop or click-to-upload class materials (PDF, slides, images, text, zip)
- 🔎 Search, sort, and filter uploaded materials in real time
- 🎨 Responsive, animated, beautiful UI (React + Shadcn UI)
- 🔐 Secure, with Firebase Firestore for metadata
- � **Cloudflare R2** for fast, cheap, and secure file storage
- 📱 Add to Home Screen (PWA Ready), Share Target support
- 🚀 Single-command deployment

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS, Shadcn UI
- **Backend:** Node.js, Express
- **Database:** Firebase Firestore
- **Storage:** Cloudflare R2
- **Hosting:** Vercel / Any Node.js host

## Quickstart

### Prerequisites
1. **Firebase Project:** Enable Firestore & Anonymous Auth.
2. **Cloudflare R2 Bucket:** Create a bucket and get API keys.
3. **Node.js:** v18+ installed.

### Local Development
1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root:
   ```env
   # Firebase (Public)
   # (These are in frontend/src/lib/firebase.ts)

   # Cloudflare R2 (Secret - Backend Only)
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=your_bucket_name
   R2_PUBLIC_URL=https://your-custom-domain.com
   ```
3. Start the app:
   ```bash
   npm start
   ```
   Visit [http://localhost:3001](http://localhost:3001)

## Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for full details.

## License
MIT License.
