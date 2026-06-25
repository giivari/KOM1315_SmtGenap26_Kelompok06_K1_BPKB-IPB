const express = require('express');
const multer = require('multer');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

// Inisialisasi Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("WARNING: SUPABASE_URL atau SUPABASE_KEY belum di-set di .env. Fitur upload akan gagal.");
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

// Menggunakan memoryStorage agar file ditahan di RAM (tidak menyentuh disk Vercel yang read-only)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  }
});

/**
 * POST /api/upload
 * Upload an image file (admin only)
 */
router.post('/', authenticate, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(req.file.originalname);
    
    // 1. Upload buffer gambar langsung ke Supabase Storage (Bucket: 'bpkb-uploads')
    const { data, error } = await supabase.storage
      .from('bpkb-uploads')
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase Storage Error:', error.message);
      return res.status(500).json({ error: 'Gagal mengunggah gambar ke cloud storage.' });
    }

    // 2. Dapatkan URL Publik dari gambar yang baru di-upload
    const { data: publicUrlData } = supabase.storage
      .from('bpkb-uploads')
      .getPublicUrl(filename);

    const publicUrl = publicUrlData.publicUrl;

    // 3. Kembalikan URL publik ke Frontend
    res.json({ path: publicUrl, filename: filename });
  } catch (error) {
    console.error('Upload catch error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan sistem saat proses upload.' });
  }
});

module.exports = router;
