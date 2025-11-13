// Simple Express server for local development
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.static('.'));
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Request body keys:', Object.keys(req.body || {}));
    console.log('Request file:', req.file ? 'Present' : 'Missing');
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No file provided' });
    }

    console.log('Uploading file:', req.file.originalname, 'Size:', req.file.size);

    // Upload to Catbox.moe
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    // Note: You can add a userhash here if you have one from Catbox.moe
    // form.append('userhash', process.env.CATBOX_USERHASH);
    if (process.env.CATBOX_USERHASH) {
    form.append('userhash', process.env.CATBOX_USERHASH);
    }
    form.append('fileToUpload', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    console.log('Sending to Catbox...');
    const catboxResponse = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    });

    const result = await catboxResponse.text();
    console.log('Catbox response status:', catboxResponse.status);
    console.log('Catbox response:', result);
    
    if (!catboxResponse.ok || !result.startsWith('https://')) {
      console.error('Catbox upload failed:', result);
      return res.status(400).json({ 
        error: 'Catbox upload failed', 
        details: result 
      });
    }

    console.log('Upload successful:', result.trim());
    return res.status(200).json({ 
      url: result.trim(),
      success: true 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Fallback for POST requests to /share-target
app.post('/share-target', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📁 Upload endpoint: http://localhost:${port}/api/upload`);
});

