# StudyHub

Share. Learn. Grow. – A modern file sharing portal for classes, study groups, and learning communities, built for secure, free, zero-maintenance deployment.

![Vercel Deploy Badge](https://vercel.com/button)

## Features
- ☁️ Drag-and-drop or click-to-upload class materials (PDF, slides, images, text, zip)
- 🔎 Search, sort, and filter uploaded materials in real time
- 🎨 Responsive, animated, beautiful UI
- 🔐 Secure, with Firebase Auth + Firestore for fast, free, scalable metadata/history
- 🔗 All files stored on Catbox.moe (no storage bills, userhash supported for ownership)
- 📱 Add to Home Screen (PWA Ready), Apple/Android Touch Icon
- 🌐 Complete metadata, Open Graph, and SEO out-of-the-box

## Tech Stack
- HTML + JS (no build step)
- [Firebase Firestore](https://firebase.google.com/) (realtime DB)
- [Firebase Auth](https://firebase.google.com/products/auth) (anonymous sign-in only)
- [Catbox.moe](https://catbox.moe/) (file upload API)
- [Vercel](https://vercel.com/) (serverless host, API route)
- [TailwindCSS](https://tailwindcss.com/) (modern utility CSS)
- [AOS](https://michalsnik.github.io/aos/) (smooth animations)

## Quickstart
1. **Deploy to Vercel** (see below or [DEPLOYMENT.md](DEPLOYMENT.md))
2. **Create Firebase project: Enable Firestore & Anonymous Auth**
3. **Set your Catbox.moe userhash in Vercel project env as `CATBOX_USERHASH`**
4. **Push files to GitHub & import to Vercel**
5. **Update site meta URL+image after first deploy (see DEPLOYMENT.md step 8)**

---

### Local Development
1. Install Node.js + npm, clone this repo
2. `npm install`
3. Add a `.env` file with:
   ```env
   CATBOX_USERHASH=your-catbox-userhash
   ```
4. `npm run dev`
5. Visit [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel
1. Sign up at [vercel.com](https://vercel.com/)
2. Link your GitHub repo or import manually
3. Add env var: `CATBOX_USERHASH=YOUR_HASH`
4. Deploy
5. After deploy, update SEO meta tags to Vercel live URL.

---

**Full details:** See [DEPLOYMENT.md](DEPLOYMENT.md) for Firebase rules, tips, and advanced configuration.

---

Copyright (c) 2024 StudyHub Team. MIT License.
