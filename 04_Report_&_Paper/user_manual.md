# Buku Panduan Pengguna (User Manual)
**Sistem Informasi BPKB IPB University**

Sistem ini menerapkan konsep *Role-Based Access Control* (RBAC) di mana fitur yang ditampilkan berbeda-beda tergantung pada tingkat akses pengguna. Dokumen ini adalah panduan lengkap cara menggunakan sistem berdasarkan tiga peran: **Guest**, **User**, dan **Admin**.

---

## 1. Panduan Pengguna Tamu (GUEST)
*Guest adalah pengunjung awam yang belum melakukan proses pendaftaran (Registrasi) atau belum Login ke dalam sistem.*

### Hak Akses dan Fitur:
Sebagai Guest, Anda hanya memiliki akses mode baca (*Read-Only*) untuk fitur-fitur publik:
1. **Melihat Beranda (Home)**: Menampilkan ringkasan statistik kampus dan berita terbaru.
2. **Membaca Artikel**: Mengklik dan membaca berita kegiatan kampus hijau IPB yang telah disetujui.
3. **Membaca Aspirasi**: Melihat daftar aspirasi/keluhan publik yang telah diajukan oleh pengguna lain.

### Keterbatasan:
- **Tidak Bisa**: Membuat aspirasi, mengirim artikel, memberikan komentar pada artikel, atau mengakses dasbor keamanan.
- **Tindakan**: Jika Anda ingin mulai berpartisipasi, klik tombol **"Login"** di pojok kanan atas, lalu pilih **"Register"** untuk membuat akun baru.

---

## 2. Panduan Pengguna Terdaftar (USER / MAHASISWA)
*User adalah mahasiswa atau dosen IPB yang telah melewati proses verifikasi otentikasi ganda (MFA OTP) via email.*

### Cara Login:
1. Buka halaman Login.
2. Masukkan Email dan Password Anda.
3. Sistem akan mengirimkan **Kode OTP 6 Digit** ke email Anda (berlaku 5 menit).
4. Masukkan kode OTP tersebut di layar untuk masuk ke dalam sistem.

### Hak Akses dan Fitur:
Selain fitur Guest, Anda memiliki akses penuh ke fitur partisipatif:
1. **Membuat Aspirasi Baru**:
   - Pergi ke halaman *Aspirations*.
   - Klik tombol **"Buat Aspirasi"**. Masukkan judul, kategori keluhan, deskripsi, dan lampirkan foto (opsional).
   - Tekan Submit.
2. **Melacak Aspirasi Saya (My Aspirations)**:
   - Pantau status aspirasi yang pernah Anda ajukan (Apakah masih *Pending*, sedang di-*Progress*, atau *Done*).
3. **Mengirim Draf Artikel (Submit Article)**:
   - Jika Anda memiliki berita liputan kegiatan mahasiswa, buka halaman *Submit Article*.
   - Isi form (Judul, Isi, Unggah Foto liputan).
   - Artikel Anda tidak akan langsung terbit, melainkan masuk status *Pending* menunggu tinjauan Admin.
4. **Pantau Draf Artikel (My Submissions)**:
   - Cek apakah draf artikel Anda disetujui (*Approved*) atau ditolak (*Rejected*) oleh BPKB.
5. **Berkomentar**:
   - Anda bebas memberikan komentar pada artikel publik apa pun.

---

## 3. Panduan Administrator (ADMIN BPKB)
*Admin adalah petugas resmi birokrasi kampus yang ditugaskan memantau sistem. Rute admin (/admin/*) dilindungi secara ketat oleh sistem otorisasi tingkat tinggi.*

### Hak Akses dan Fitur Khusus Admin:
Setelah Admin berhasil login dan lolos verifikasi OTP, Admin akan memiliki tombol **"Admin Dashboard"** di navigasi utama.

1. **Manajemen Artikel (Tinjauan Jurnalisme)**
   - Buka menu **Admin Articles**.
   - Admin dapat melihat semua draf artikel yang dikirim oleh *User* (Status: Pending).
   - Klik **Approve** agar berita tersebut tayang di halaman publik, atau **Reject** jika beritanya tidak layak.
   - Admin juga berhak menyunting ulang atau menghapus artikel apa pun.

2. **Manajemen Aspirasi (Tindak Lanjut Keluhan)**
   - Buka menu **Admin Aspirations**.
   - Baca keluhan masuk. Admin dapat mengubah status keluhan dari *Pending* menjadi **In Progress** (Sedang ditindaklanjuti BPKB) lalu menjadi **Done** (Telah selesai).

3. **Dokumentasi & Operasi Laporan Bulanan (Keamanan Berlapis)**
   - Buka menu **Admin Docs/Operations**.
   - Admin mengunggah laporan resmi operasional kampus (seperti statistik energi/air).
   - *Catatan Keamanan*: Setiap kali Admin menekan tombol "Simpan" pada dokumen resmi ini, di belakang layar sistem akan otomatis menciptakan **Tanda Tangan Digital RSA (Digital Signature)**. Jika ada yang mencoba meretas *database* dan mengubah isi laporan ini dari belakang, laporan tersebut akan memunculkan status "Cacat / Invalid".

4. **Pemantauan Dasbor Keamanan (Security Audit Logs)**
   - Buka menu **Security Dashboard**.
   - Ini adalah pusat komando pelacakan *Accounting*. Admin dapat melihat secara detail siapa yang melakukan apa (Misal: *"User X mencoba masuk ke halaman admin namun ditolak"*).
   - *Catatan Keamanan*: Seluruh IP Address pengunjung yang tercatat di Dasbor ini ditarik dari database dalam keadaan terenkripsi (Acak). Node.js mendeskripsinya secara otomatis (*Real-time AES-256 Decryption*) sehingga hanya Anda (sebagai Admin) yang bisa membaca teks asli IP tersebut di layar.
