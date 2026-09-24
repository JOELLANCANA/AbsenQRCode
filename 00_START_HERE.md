# 🎯 START HERE - Sistem Absensi QR Code UIN Ar-Raniry

Selamat datang! Berikut adalah panduan untuk memulai menggunakan sistem absensi QR code.

---

## 🚀 Akses Aplikasi

**URL Deployment (SUDAH AKTIF ✅):**
```
https://script.google.com/a/macros/ar-raniry.ac.id/s/AKfycbxwo5WCMyLIPl9s79YbGG3UzNAYVAzCbdfjmNnoo-vWi5_BYolta2SpFQVEUUPivH8Lkg/exec
```

**Status**: ✅ PRODUCTION READY & DEPLOYED

---

## 📖 Pilih Peran Anda

### 👤 Saya Peserta (Mau Absen)

**Waktu**: 2 menit
1. Buka URL di atas
2. Izinkan kamera
3. Scan QR code Anda
4. Pilih status (HADIR/KELUAR/MASUK KEMBALI)
5. Selesai!

👉 **Baca**: [QUICK_START.md](QUICK_START.md) - Panduan singkat dalam 5 menit

---

### 👨‍💼 Saya Admin (Kelola Sistem)

**Waktu**: 15 menit
1. Buka URL di atas
2. Click tab "Admin & Laporan"
3. Login dengan password: `adminArRaniry2026`
4. Manage peserta, generate QR, print laporan

👉 **Baca**: [QUICK_START.md](QUICK_START.md) → Admin Section

---

### 🔧 Saya Setup/Maintenance (Tech Person)

**Fase 1 - Verify Setup**: 10 menit
- Baca: [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md)
- Ikuti checklist untuk verify semua bekerja
- Jika semua ✅ → DONE! Sistem ready!

**Fase 2 - Jika Ada Masalah**: 
- Baca: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Find your issue & solution
- Apply fix & test

**Fase 3 - Deploy ke Vercel (Optional, Advanced)**:
- Baca: [vercel-backend/README.md](vercel-backend/README.md)
- Setup backend untuk scalability
- Update frontend ke Vercel API

**Fase 4 - Deep Technical Understanding**:
- Baca: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- Understand architecture & flow
- Prepare untuk custom modifications

---

### 📚 Saya Mau Dokumentasi Lengkap

**Semua dokumentasi tersedia**:

| File | Untuk | Waktu |
|------|-------|-------|
| **[QUICK_START.md](QUICK_START.md)** | Penggunaan dasar | 5 min |
| **[VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md)** | Verify setup works | 10 min |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Fix issues | 20 min |
| **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** | Setup dari nol | 30 min |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | Deploy instructions | 15 min |
| **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** | Technical architecture | 30 min |
| **[README.md](README.md)** | Overview & features | 5 min |

---

## 🎯 Next Steps (Choose One)

### Option 1: Saya Mau Langsung Pakai (RECOMMENDED)
```
1. ✓ System sudah deployed
2. ✓ Semua files sudah setup
3. → Buka URL deployment di atas
4. → Baca QUICK_START.md
5. → Mulai gunakan!
```

### Option 2: Saya Mau Verify Semuanya Bekerja
```
1. → Buka URL deployment
2. → Follow VERIFICATION_GUIDE.md
3. → Complete semua test steps
4. → Confirm all ✅
```

### Option 3: Saya Ada Masalah
```
1. → Lihat error message
2. → Buka TROUBLESHOOTING.md
3. → Find your issue
4. → Follow solution
5. → Test & verify
```

### Option 4: Saya Ingin Setup Manual dari Nol
```
1. → Buka SETUP_CHECKLIST.md
2. → Follow Phase 1-6
3. → Complete checklist
4. → System ready!
```

---

## ✨ Key Information

| Item | Value |
|------|-------|
| **App URL** | https://script.google.com/a/macros/ar-raniry.ac.id/... |
| **Spreadsheet** | [Google Sheets](https://docs.google.com/spreadsheets/d/11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk) |
| **Drive Folder** | [Google Drive](https://drive.google.com/drive/folders/1T2KFEN5avSOW25-cUHub-ZF2U2unSpU2) |
| **Admin Password** | `adminArRaniry2026` |
| **Status** | ✅ PRODUCTION READY |

---

## 🎓 How It Works

```
Peserta
  ↓
Scan QR Code atau Input Manual ID
  ↓
Select Status (HADIR / KELUAR / MASUK KEMBALI)
  ↓
Data tersimpan ke Google Sheets
  ↓
Log riwayat terupdate real-time
  ↓
Admin bisa lihat, export, print laporan
```

---

## 📱 Features

✅ **QR Code Scanner** - Scan langsung dari kamera
✅ **Real-time Status** - Update instant ke Google Sheets
✅ **Manual Input** - Fallback jika kamera error
✅ **Live Feed** - Monitor activity real-time
✅ **Admin Dashboard** - Manage peserta & reports
✅ **Google Integration** - Data di Sheets & Drive
✅ **Mobile Support** - Works on phone/tablet
✅ **No Installation** - Buka di browser, langsung pakai

---

## ⚡ Quick Troubleshooting

### Camera tidak bekerja?
→ Lihat [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Camera Section

### Data tidak tersimpan?
→ Lihat [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Data Section

### UI error atau tidak loading?
→ Lihat [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Frontend Section

### Lainnya?
→ Search in [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 29+ solutions tersedia

---

## 📞 File Directory

```
ABSENSI/
├── 📄 00_START_HERE.md ← You are here!
├── 📄 README.md - Overview
├── 📄 QUICK_START.md - 5 min guide ⭐
├── 📄 VERIFICATION_GUIDE.md - Test everything
├── 📄 SETUP_CHECKLIST.md - Setup dari nol
├── 📄 DEPLOYMENT_GUIDE.md - Deploy steps
├── 📄 INTEGRATION_GUIDE.md - Technical details
├── 📄 TROUBLESHOOTING.md - Fix issues
│
├── 📱 Code.gs - Backend (Google Apps Script)
├── 🌐 Index.html - Frontend (UI)
├── ⚙️ camera-handler.js - Camera & QR
├── 🔌 gapps-sync.js - Communication
├── ⚙️ appsscript.json - Config
│
└── vercel-backend/ - Optional backend
    ├── index.js
    ├── package.json
    ├── vercel.json
    └── README.md
```

---

## 🚀 Getting Started in 3 Steps

### Step 1: Open App (30 sec)
Copy-paste URL ke browser:
```
https://script.google.com/a/macros/ar-raniry.ac.id/s/AKfycbxwo5WCMyLIPl9s79YbGG3UzNAYVAzCbdfjmNnoo-vWi5_BYolta2SpFQVEUUPivH8Lkg/exec
```

### Step 2: Allow Camera (30 sec)
1. Browser akan ask for camera permission
2. Click "Allow"
3. Camera preview harus muncul

### Step 3: Scan or Input (1 min)
1. Scan QR code Anda
2. Atau input manual ID
3. Select status
4. ✅ Done!

---

## ✅ Verification Checklist

Before sharing dengan participants, verify:

- [ ] Web app loads without error
- [ ] Camera scanner works
- [ ] Manual input works
- [ ] Status update saves to Sheets
- [ ] Admin dashboard accessible
- [ ] Google Sheets punya data
- [ ] Google Drive punya QR files

👉 Full checklist di: [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md)

---

## 📊 Expected Experience

### For Participants:
- Fast: Scan & status update dalam ~30 sec
- Easy: Hanya 3 klik (scan → status → selesai)
- Mobile: Works di smartphone dengan sempurna
- Reliable: Tidak perlu install app, hanya buka URL

### For Admins:
- Powerful: Generate reports, print cards, manage data
- Real-time: Live monitoring of attendance
- Integrated: Data otomatis ke Google Sheets
- Flexible: Export & customize reports

---

## 🎯 Success Criteria

Sistem dianggap berhasil jika:

✅ Dapat di-akses dari browser (sudah ✓)
✅ Semua tab bekerja (navigation responsive)
✅ Camera permission granted & scanner works
✅ Status update tersimpan ke Google Sheets
✅ Admin login works dengan password
✅ Log riwayat terupdate real-time
✅ Works di mobile browser
✅ No critical errors di console

👉 Verify di: [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md)

---

## 🎉 Ready?

**Pilih salah satu:**

1. 👤 **Saya Peserta** → Buka URL & scan QR
2. 👨‍💼 **Saya Admin** → Buka URL, login, manage
3. 🔧 **Saya Tech** → Baca VERIFICATION_GUIDE.md
4. 📚 **Saya Ingin Tahu Lebih Banyak** → Baca README.md

---

## 💡 Pro Tips

✅ **Untuk peserta**: Scan dalam kondisi cahaya cukup untuk hasil terbaik
✅ **Untuk admin**: Backup data regularly dengan download Google Sheet
✅ **Untuk tech**: Monitor browser console untuk debug info
✅ **Umum**: Jika ada error, cek TROUBLESHOOTING.md terlebih dahulu

---

## 📞 Need Help?

1. **Quick answer?** → Check QUICK_START.md
2. **Problem?** → Check TROUBLESHOOTING.md
3. **Setup issue?** → Check SETUP_CHECKLIST.md
4. **Technical?** → Check INTEGRATION_GUIDE.md
5. **Still stuck?** → Check all sections in README.md

---

**🎊 Welcome to Sistem Absensi QR Code UIN Ar-Raniry!**

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: September 24, 2026

**Next**: Pick your role above and get started! 🚀
