// Vercel serverless function for uploading to Catbox.moe
const Busboy = require('busboy');
const FormData = require('form-data');
const fetch = require('node-fetch');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const busboy = Busboy({ headers: req.headers });
    let fileBuffer = null;
    let fileName = null;
    let fileMime = null;

    await new Promise((resolve, reject) => {
      busboy.on('file', (_fieldname, file, info) => {
        const { filename, mimeType } = info;
        fileName = filename;
        fileMime = mimeType;
        const chunks = [];
        file.on('data', (d) => chunks.push(d));
        file.on('end', () => { fileBuffer = Buffer.concat(chunks); });
      });
      busboy.on('finish', resolve);
      busboy.on('error', reject);
      req.pipe(busboy);
    });

    if (!fileBuffer || !fileName) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const form = new FormData();
    form.append('reqtype', 'fileupload');
    if (process.env.CATBOX_USERHASH) form.append('userhash', process.env.CATBOX_USERHASH);
    form.append('fileToUpload', fileBuffer, { filename: fileName, contentType: fileMime });

    const catboxResponse = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
    const result = await catboxResponse.text();
    if (!catboxResponse.ok || !result.startsWith('https://')) {
      console.error('Catbox upload failed:', result);
      return res.status(400).json({ error: 'Catbox upload failed', details: result });
    }

    return res.status(200).json({ url: result.trim(), success: true });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
