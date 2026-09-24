# 📱 Panduan Lengkap Deployment - Sistem Absensi QR Code UIN Ar-Raniry

## 📋 Table of Contents
1. [Setup Google Apps Script](#setup-google-apps-script)
2. [Upload Files ke Apps Script](#upload-files-ke-apps-script)
3. [Deploy sebagai Web App](#deploy-sebagai-web-app)
4. [Setup Vercel Backend (Optional)](#setup-vercel-backend-optional)
5. [Troubleshooting](#troubleshooting)
6. [Testing & Verification](#testing--verification)

---

## 1. Setup Google Apps Script

### Langkah 1.1: Buka Google Apps Script
1. Buka Google Sheet Anda: https://docs.google.com/spreadsheets/d/11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk
2. Di menu, klik **Extensions** → **Apps Script**
3. Ini akan membuka editor Apps Script di tab baru

### Langkah 1.2: Setup File Structure di Apps Script
Editor Apps Script Anda harus memiliki struktur:

```
📁 Project
├── 📄 Code.gs (Backend logic)
├── 📄 Index.html (Frontend/UI)
├── 📄 camera-handler.js (Camera & QR scanner)
├── 📄 gapps-sync.js (Komunikasi dengan GAS)
└── 📄 appsscript.json (Konfigurasi)
```

### Langkah 1.3: Update Spreadsheet ID di Code.gs
Pastikan `SPREADSHEET_ID` di Code.gs sudah sesuai:

```javascript
const SPREADSHEET_ID = '11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk';
const DRIVE_FOLDER_ID = '1T2KFEN5avSOW25-cUHub-ZF2U2unSpU2';
```

✅ **Kedua ID sudah benar dan update!**

---

## 2. Upload Files ke Apps Script

### Langkah 2.1: Upload Code.gs
1. Di Apps Script editor, klik **+ > Create new file > Script**
2. Namakan file: `Code`
3. Copy-paste seluruh isi `Code.gs` ke sini
4. **Simpan** (Ctrl+S)

### Langkah 2.2: Upload Index.html
1. Klik **+ > Create new file > Html**
2. Namakan file: `Index`
3. Copy-paste seluruh isi `index.html` ke sini
4. **Simpan** (Ctrl+S)

### Langkah 2.3: Upload camera-handler.js
1. Klik **+ > Create new file > Script**
2. Namakan file: `CameraHandler`
3. Copy-paste isi `camera-handler.js` ke sini
4. **Simpan** (Ctrl+S)

### Langkah 2.4: Upload gapps-sync.js
1. Klik **+ > Create new file > Script**
2. Namakan file: `GAppsSync`
3. Copy-paste isi `gapps-sync.js` ke sini
4. **Simpan** (Ctrl+S)

### Langkah 2.5: Upload appsscript.json
1. Klik **Project Settings** (ikon gerigi di sidebar kiri)
2. Scroll ke bawah, enable **"Show "appsscript.json" manifest file in editor"**
3. Di sidebar kiri, klik file `appsscript.json` (akan muncul sekarang)
4. Copy-paste isi `appsscript.json`
5. **Simpan** (Ctrl+S)

---

## 3. Deploy sebagai Web App

### Langkah 3.1: Deploy New Version
1. Di Apps Script editor, klik tombol **Deploy** (pojok kanan atas)
2. Pilih **New deployment**
3. Pada **Select type**, pilih **Web app**
4. Isi field:
   - **Execute as**: Akun Google yang memiliki akses Sheet & Drive
   - **Who has access**: `Anyone`
5. Klik **Deploy**
6. Akan muncul URL deployment seperti:
   ```
   https://script.google.com/macros/d/[SCRIPT_ID]/usercache/[VERSION]/
   ```
7. **Copy URL ini** - ini adalah link aplikasi Anda

### Langkah 3.2: Grant Permissions
- Saat pertama kali deploy, Apps Script minta izin akses Google Sheet & Drive
- Klik tombol yang diminta untuk authorize
- Proses ini hanya perlu dilakukan sekali

---

## 4. Setup Vercel Backend (Optional)

### Kapan Perlu Vercel?
- Jika ingin custom API logic
- Jika ingin database selain Google Sheet
- Jika ingin scaling dan reliability lebih tinggi

### Langkah 4.1: Siapkan Vercel Project
1. Buat folder project baru di lokal:
   ```bash
   mkdir absensi-backend
   cd absensi-backend
   ```

2. Initialize Node.js project:
   ```bash
   npm init -y
   npm install express cors dotenv googleapis
   ```

3. Buat file `.env`:
   ```
   SPREADSHEET_ID=11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk
   DRIVE_FOLDER_ID=1T2KFEN5avSOW25-cUHub-ZF2U2unSpU2
   ADMIN_PASSWORD=adminArRaniry2026
   ```

4. Buat file `api/participants.js` (lihat VERCEL_API_ENDPOINTS.md)

5. Deploy ke Vercel:
   ```bash
   npm install -g vercel
   vercel
   ```

6. Setelah deploy, update URL di `index.html`:
   ```javascript
   window.API_BASE_URL = 'https://your-vercel-domain.vercel.app/api';
   ```

---

## 5. Troubleshooting

### ❌ Error: "Spreadsheet tidak ditemukan"
**Solusi:**
- Pastikan `SPREADSHEET_ID` benar di `Code.gs`
- Pastikan akun Google Apps Script memiliki akses ke Sheet
- Coba buka Sheet URL di browser untuk verifikasi akses

### ❌ Error: "Izin Kamera Ditolak"
**Solusi:**
1. **Chrome/Edge**: 
   - Klik ikon gembok di URL bar
   - Klik "Izin" → Kamera → "Izinkan"
   - Reload halaman

2. **Firefox**:
   - Menu → Settings → Privacy & Security
   - Cari "Permissions → Camera"
   - Tambahkan domain dan izinkan

3. **Mobile (Android)**:
   - Settings → Apps → [Browser Name]
   - Permissions → Camera → Allow

4. **Mobile (iOS)**:
   - Settings → [Browser Name] → Camera → Allow

### ❌ Error: "Kamera tidak ditemukan"
**Solusi:**
- Periksa koneksi hardware kamera
- Restart browser dan device
- Gunakan browser lain untuk test
- Gunakan input manual sebagai fallback

### ❌ QR Scanner tidak bekerja di index.html
**Solusi:**
- Pastikan file `camera-handler.js` di-load sebelum script lainnya
- Check browser console (F12) untuk error messages
- Pastikan izin kamera sudah diberikan

### ❌ Data tidak tersimpan di Sheet
**Solusi:**
- Check Google Sheet permissions
- Pastikan Sheet memiliki kolom yang benar:
  - DataPeserta: [ID, Nama, NIM, Email, Kategori, Status, Waktu, QR URL]
  - LogAbsensi: [No, Waktu Log, ID, Nama, NIM, Status, Kategori]
- Cek console log untuk error message detail

### ❌ "Cannot read property 'getByName' of undefined"
**Solusi:**
- Pastikan `Code.gs` sudah upload dengan benar
- Run fungsi `setupSheet()` di editor untuk inisialisasi

### ❌ Admin login tidak bekerja
**Solusi:**
- Default password: `adminArRaniry2026`
- Untuk change password, edit di `Code.gs`:
  ```javascript
  const DEFAULT_PASS = 'PASSWORD_BARU_ANDA';
  ```
- Pastikan function `verifyAdminLogin()` sudah di-upload

---

## 6. Testing & Verification

### ✅ Test Checklist

#### 6.1 Basic Functionality
- [ ] Web app bisa dibuka di browser
- [ ] UI loading dengan benar
- [ ] Data peserta muncul di tab "Data Peserta"
- [ ] Log riwayat muncul di tab "Log Riwayat"

#### 6.2 Scanner QR
- [ ] Kamera permission granted
- [ ] Scanner UI muncul dengan normal
- [ ] QR Code bisa di-scan
- [ ] Scan beep sound terdengar
- [ ] Participant card muncul setelah scan

#### 6.3 Status Update
- [ ] Klik tombol "HADIR" → data tersimpan
- [ ] Klik tombol "KELUAR" → data tersimpan
- [ ] Klik tombol "MASUK KEMBALI" → data tersimpan
- [ ] Log riwayat terupdate real-time
- [ ] Status di tabel berubah sesuai update

#### 6.4 Admin Features
- [ ] Login dengan password benar
- [ ] Dashboard admin terbuka
- [ ] Generate QR Codes → QR tersimpan di Drive
- [ ] Upload Excel → Data terimport
- [ ] Cetak laporan PDF → Berhasil print

#### 6.5 Mobile Compatibility
- [ ] Buka di mobile browser (Chrome/Safari)
- [ ] UI responsive dan readable
- [ ] Kamera permission work di mobile
- [ ] Scanner QR work di mobile

#### 6.6 Fallbacks
- [ ] Jika kamera error → UI manual input bekerja
- [ ] Jika GAS offline → Mock data fallback
- [ ] Jika internet timeout → Error message friendly

### 6.7 Test Scan QR Code
Gunakan QR codes dari folder Google Drive Anda:
1. Buka Drive: https://drive.google.com/drive/folders/1T2KFEN5avSOW25-cUHub-ZF2U2unSpU2
2. Test scan salah satu QR code peserta
3. Verifikasi data peserta muncul dengan benar

---

## 📞 Support & Contact

Jika mengalami error atau issue yang tidak tercantum di atas:

1. **Check Console Log**:
   - Buka DevTools (F12 di browser)
   - Tab Console
   - Copy error message lengkap

2. **Check Google Sheet Access**:
   - Pastikan akun Google memiliki edit access ke Sheet
   - Share Sheet dengan akun Apps Script jika perlu

3. **Check Google Apps Script Logs**:
   - Di Apps Script editor, klik **Execution log** (ikon riwayat)
   - Lihat error detail dari eksekusi function

4. **Contact Admin**:
   - Email: admin@ar-raniry.ac.id
   - Berikan: Screenshot error + Console log + Browser info

---

## 🎯 Next Steps

Setelah deployment berhasil:

1. **Test dengan real users** - Pastikan semua fitur bekerja optimal
2. **Training peserta** - Jelaskan cara scan QR dan use UI
3. **Backup data regular** - Download Google Sheet regularly
4. **Monitor logs** - Check "Log Riwayat" untuk activity tracking
5. **Setup reminders** - Bikin jadwal clear/archive old logs

---

**Last Updated**: September 24, 2026
**Version**: 1.0 - Production Ready
