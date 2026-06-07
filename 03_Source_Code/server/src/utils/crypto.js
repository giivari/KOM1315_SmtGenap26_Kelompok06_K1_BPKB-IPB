const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Lokasi penyimpanan kunci RSA di root folder server
const privateKeyPath = path.join(__dirname, '../../private.pem');
const publicKeyPath = path.join(__dirname, '../../public.pem');

/**
 * Fungsi untuk menghasilkan kunci RSA baru jika belum ada
 * Di lingkungan produksi, kunci ini biasanya dibuat terpisah oleh tim DevOps
 */
function ensureKeysExist() {
  if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    console.log('🔒 Kunci RSA tidak ditemukan. Sedang melakukan generate Keypair baru...');
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);
    console.log('✅ RSA Keypair berhasil dibuat dan disimpan ke private.pem & public.pem');
  }
}

// Jalankan pengecekan saat server pertama kali menyala
ensureKeysExist();

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

/**
 * Fungsi untuk menghasilkan Hash SHA-256
 * (Telah diubah namanya menjadi hashSHA256 agar cocok dengan otp.js)
 */
function hashSHA256(dataString) {
  // Pastikan input berupa string
  const data = typeof dataString === 'string' ? dataString : JSON.stringify(dataString);
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Fungsi untuk memverifikasi Hash SHA-256
 * (Ditambahkan karena dibutuhkan oleh otp.js untuk login)
 */
function verifySHA256(input, storedHash) {
  const inputHash = hashSHA256(input);
  return inputHash === storedHash;
}

/**
 * Fungsi untuk menandatangani data menggunakan Private Key (RSA)
 */
function signData(data) {
  // Pastikan data diubah menjadi string (karena auth.js mengirimkan format JSON/Object)
  const dataString = typeof data === 'string' ? data : JSON.stringify(data);
  
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(dataString);
  signer.end();
  // Kembalikan signature dalam bentuk Base64 agar aman disimpan di database
  return signer.sign(privateKey, 'base64');
}

// Export fungsi-fungsi dengan nama yang tepat
module.exports = { hashSHA256, verifySHA256, signData };