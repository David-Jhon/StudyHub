# 🚀 StudyHub Deployment Guide

## 1. Features
- Drag & drop/share study files (PDF, PPT, images, txt, zip)
- Real-time listing/search
- Beautiful, SEO & Open Graph ready
- Free: Vercel cloud + Firebase (Firestore, Auth) + Catbox.moe

## 2. Prerequisites
- Firebase account (Firestore, anonymous auth enabled)
- Catbox.moe userhash (for file management)
- [Vercel](https://vercel.com/) account (free)

## 3. Firebase Setup
- Go to [Firebase Console](https://console.firebase.google.com/)
- Enable Firestore, create DB
- Enable Authentication → Anonymous
- Set **rules** for Firestore:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /materials/{id} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update, delete: if false;
      }
    }
  }
  ```

## 4. Vercel Setup
1. Import your repo in Vercel
2. Go to Settings > Environment Variables:
   - Add: `CATBOX_USERHASH=YOUR_CATBOX_USERHASH`
3. Deploy (click 'Deploy')

---

## 5. After Deploy: Update SEO/Meta
Once you get your Vercel live URL (e.g. `https://foobar.vercel.app`):
- In `index.html`, update:
  ```html
  <link rel="canonical" href="https://foobar.vercel.app/">
  <meta property="og:url" content="https://foobar.vercel.app/">
  <meta name="twitter:url" content="https://foobar.vercel.app/">
  ```
  ...and redeploy for perfect sharing/SEO!

---

## 6. (Optional) Custom Domain
- Add a domain at Vercel
- Update meta URLs as above if needed

---

## 7. Local Development
- `npm install`
- `.env` file:  `CATBOX_USERHASH=your-hash-here`
- `npm run dev` then visit [http://localhost:3000](http://localhost:3000)

---

## 8. Adding/Editing Site Assets
- To change favicon or Open Graph image, use SVG or PNG
- Edit logo, icons, and social images in `/public` or inline in `<head>` (see index.html example)

---

## 9. What if Catbox uploads don’t appear in your account?
- Make sure CATBOX_USERHASH is set before uploading **and** on Vercel, and redeploy after changes!
- Old uploads can’t be “claimed”—new ones will appear in your Catbox dashboard.

---

## 10. Support/License
- Free for all educational & organization use. See [LICENSE](LICENSE).
