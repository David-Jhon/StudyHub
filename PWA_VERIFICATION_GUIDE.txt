# PWA & Share Target Verification Guide

## Overview
This guide explains how to verify that your Progressive Web App (PWA) is working correctly and that the Share Target feature allows users to upload files directly from other apps on their mobile devices.

---

## 🌐 Step 1: Deploy to Production

**Important**: PWAs require HTTPS to work. Localhost testing has limitations.

1. Deploy your app to Render (or your production server)
2. Ensure your site is accessible at `https://slidedokan.onrender.com/`

---

## 📱 Step 2: Install the PWA on Mobile

### Android (Chrome/Edge)

1. Open `https://slidedokan.onrender.com/` in **Chrome** or **Edge**
2. Look for the **"Add to Home Screen"** prompt (banner at the bottom)
   - If it doesn't appear automatically, tap the **⋮** (three dots) menu → **"Add to Home screen"**
3. Confirm the installation
4. The **StudyHub** icon should now appear on your home screen

### iOS (Safari)

1. Open `https://slidedokan.onrender.com/` in **Safari**
2. Tap the **Share** button (square with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Confirm the installation
5. The **StudyHub** icon should now appear on your home screen

---

## ✅ Step 3: Verify PWA Installation

### Check if it's running as a PWA:
1. **Launch the app** from your home screen (not from the browser)
2. The app should open **without browser UI** (no address bar, no browser tabs)
3. It should look like a native app

### Check the manifest:
- In Chrome DevTools (desktop): **Application** → **Manifest**
- Verify:
  - Name: "StudyHub"
  - Icons: `icon.svg`
  - Start URL: `/`
  - Display: `standalone`

---

## 🔗 Step 4: Test Share Target Feature

This is the key feature that allows users to share files from other apps directly to StudyHub.

### Android

1. **Open any file manager** (Google Files, Gallery, etc.)
2. Select a **PDF, image, or video**
3. Tap the **Share** button
4. Look for **"StudyHub"** in the share sheet
   - If it doesn't appear immediately, tap **"More"** or scroll through the apps
5. Tap **StudyHub**
6. The app should open with the **Upload Modal** pre-filled with your selected file
7. Enter a title and tap **Upload**

### iOS

> **Note**: iOS has limited Share Target support. The feature works best on Android.

1. Open **Files** or **Photos**
2. Select a file
3. Tap the **Share** button
4. Look for **"StudyHub"** in the share sheet
5. If available, tap it to upload

---

## 🐛 Troubleshooting

### PWA doesn't install
- ✅ Ensure you're using **HTTPS** (not HTTP)
- ✅ Check that `manifest.webmanifest` is being served correctly
- ✅ Verify `icon.svg` exists in `/frontend/public/`
- ✅ Clear browser cache and try again

### Share Target doesn't appear
- ✅ Make sure the PWA is **installed** (not just bookmarked)
- ✅ On Android, try **uninstalling and reinstalling** the PWA
- ✅ Check that `share_target` is correctly configured in [vite.config.ts](file:///d:/Code%20Exp/IDK/New%20folder%20%282%29/frontend/vite.config.ts)
- ✅ Verify the Service Worker is registered (DevTools → Application → Service Workers)

### Upload doesn't work after sharing
- ✅ Check browser console for errors
- ✅ Verify the Service Worker is handling the `/share-target` POST request
- ✅ Ensure `idb-keyval` is storing the shared file correctly

---

## 🔍 Advanced Debugging

### Check Service Worker
1. Open Chrome DevTools (desktop or via `chrome://inspect` for mobile)
2. Go to **Application** → **Service Workers**
3. Verify `sw.js` is **activated and running**
4. Check for errors in the Service Worker console

### Test Share Target Locally (Android Only)
1. Use **Chrome DevTools** → **Remote Devices**
2. Connect your Android phone via USB
3. Enable **USB Debugging** on your phone
4. Inspect the PWA and check the console when sharing a file

---

## 📊 Expected Behavior

### ✅ Successful PWA Installation
- App launches without browser UI
- Icon appears on home screen
- Works offline (for cached pages)

### ✅ Successful Share Target
- "StudyHub" appears in the share sheet
- Upload modal opens with the shared file pre-loaded
- File uploads to Cloudflare R2 and metadata saves to Firebase

---

## 🎯 Next Steps

Once verified:
1. Share the link with your users
2. Instruct them to **install the PWA** for the best experience
3. They can now **share files directly** from any app to StudyHub!
