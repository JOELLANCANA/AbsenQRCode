# 🚀 Quick Start - Sistem Absensi QR Code

Panduan cepat untuk mulai menggunakan sistem dalam 5 menit.

---

## 📱 Untuk Peserta (Pengguna Umum)

### Step 1: Buka Aplikasi (30 detik)

Buka link ini di browser:
```
https://script.google.com/a/macros/ar-raniry.ac.id/s/AKfycbxwo5WCMyLIPl9s79YbGG3UzNAYVAzCbdfjmNnoo-vWi5_BYolta2SpFQVEUUPivH8Lkg/exec
```

**Apa yang akan terlihat:**
- Header hijau UIN Ar-Raniry
- Scanner QR code
- Tombol untuk input manual

### Step 2: Izinkan Kamera (30 detik)

1. Browser akan minta izin kamera
2. Click "Izinkan" / "Allow"
3. Camera preview harus muncul dengan laser animation

**Jika tidak ada camera:**
- Gunakan **Input Manual** di bawah (lihat Step 4)

### Step 3: Scan QR Code Anda (30 detik)

1. Arahkan camera ke QR code Anda
2. QR akan otomatis detect (tidak perlu klik)
3. Beep sound akan terdengar
4. Kartu peserta akan muncul

### Step 4: Pilih Status Anda (30 detik)

Klik salah satu dari 3 tombol:

- **HADIR** 🟢 - Saat pertama kali masuk
- **KELUAR** 🔴 - Saat keluar atau izin
- **MASUK KEMBALI** 🔵 - Saat kembali dari keluar

### Step 5: Selesai! ✅

Toast notification akan muncul:
```
✓ Status [HADIR] berhasil disimpan untuk [Nama Anda]
```

Data Anda sudah tercatat!

---

## 🖱️ Alternative: Input Manual

Jika camera tidak bekerja:

1. Scroll ke bawah di scanner area
2. Di field "Atau Input Manual ID Peserta"
3. Ketik ID Anda (contoh: `UIN-001`)
4. Click tombol "Cari"
5. Card dengan data Anda akan muncul
6. Select status dan selesai!

---

## 💡 Tips

### Untuk Scan QR yang Lebih Baik:

- ✅ QR code berukuran ~2-3 cm
- ✅ Jarak optimal 10-15 cm dari camera
- ✅ Pastikan dalam cahaya yang baik
- ✅ Jangan backlit (cahaya dari belakang QR)
- ✅ Tidak perlu klik apapun, akan auto-detect

### Jika Scanner Error:

- Coba reload halaman (Ctrl+R / Cmd+R)
- Cek izin camera di browser settings
- Gunakan input manual sebagai backup
- Contact admin jika masih error

---

## 👨‍💼 Untuk Administrator

### Access Admin Dashboard

1. Click tab: "Admin & Laporan"
2. Enter password: `adminArRaniry2026`
3. Click: "Masuk Dashboard"

### Admin Features

#### 1. Kelola Data Peserta
- View semua peserta & status terakhir
- See last attendance time
- Download sebagai laporan

#### 2. Generate QR Code Drive
- Generate QR codes untuk semua peserta
- Simpan otomatis ke Google Drive
- Create printable badges

#### 3. Cetak Laporan PDF
- Print comprehensive attendance report
- Show summary status
- Show detailed log history
- Sign & date untuk resmi

---

## 📊 Monitor Real-Time

### Dashboard Stats (Top of Page)

- **Total Peserta** - Jumlah semua peserta
- **Sedang Hadir** - Peserta dengan status HADIR
- **Sedang Keluar** - Peserta dengan status KELUAR
- **Total Aktivitas Log** - Jumlah semua action log

### Live Activity Feed

Scroll ke bawah untuk lihat real-time activity:
- Newest activities on top
- Show nama peserta, ID, status, waktu
- Auto-refresh setiap beberapa detik

---

## 🔍 View Data

### Data Peserta Tab

- See tabel dengan semua peserta
- Search by nama, NIM, atau ID
- Filter by status
- View QR code per peserta

### Log Riwayat Tab

- See semua action history
- Search by nama atau status
- Timestamp exact untuk setiap action
- Export untuk laporan

---

## ❓ FAQ

### Q: Berapa kali saya bisa scan?
**A**: Unlimited! Setiap scan buat entry baru di log. Tapi status peserta hanya update yang terakhir.

### Q: Bagaimana jika saya scan 2x?
**A**: No problem. Status akan update ke yang terbaru. Log akan record keduanya.

### Q: Bagaimana jika internet mati saat scan?
**A**: Scanner masih bekerja offline. Tapi data akan sync otomatis saat internet kembali.

### Q: Bisa print laporan?
**A**: Ya! Admin bisa click "Cetak Laporan PDF" untuk print rekapitulasi & log.

### Q: Bisa import data dari Excel?
**A**: Ya! Admin bisa click "Upload Excel" untuk batch import peserta.

### Q: Data aman?
**A**: Ya! Data tersimpan di Google Sheets yang secure & encrypted. Access-controlled.

---

## ⏱️ Time Guide

| Activity | Time |
|----------|------|
| Buka app | 30 sec |
| Allow camera | 30 sec |
| Scan QR | 30 sec |
| Select status | 30 sec |
| **Total** | **~2 min** |

Manual input version: ~1.5 min (faster without camera)

---

## 🎯 Common Scenarios

### Scenario 1: Peserta Masuk Pertama Kali
1. Open app
2. Scan QR atau input ID
3. Click "HADIR"
4. ✅ Done!

### Scenario 2: Peserta Mau Keluar/Izin
1. Scan/input ID
2. Click "KELUAR"
3. ✅ Status terupdate

### Scenario 3: Peserta Kembali Setelah Keluar
1. Scan/input ID
2. Click "MASUK KEMBALI"
3. ✅ Status updated kembali ke hadir

### Scenario 4: Admin Ingin Print Laporan
1. Click "Admin & Laporan"
2. Login dengan password
3. Click "Cetak Laporan PDF"
4. Review & print
5. ✅ Laporan ready

---

## 🚨 Troubleshooting Quick Fix

| Problem | Solution |
|---------|----------|
| Camera permission denied | Check TROUBLESHOOTING.md → Camera Issues |
| QR tidak detect | Try manual input atau better lighting |
| Data tidak tersimpan | Refresh page, check internet connection |
| Login password salah | Default: `adminArRaniry2026` |
| Page load error | Clear browser cache → Ctrl+Shift+Delete |
| Mobile camera not work | Check phone camera permission in Settings |

---

## 📚 Detailed Docs

Untuk info lebih lengkap, lihat:

- **Setup Issues?** → [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
- **Problems?** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Technical?** → [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **Deployment?** → [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Verify setup?** → [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md)

---

## 📞 Help

Jika ada masalah:

1. **Check browser console** - F12 → Console tab
2. **Try in different browser** - Chrome/Firefox/Safari
3. **Clear cache** - Ctrl+Shift+Delete
4. **Reload page** - Ctrl+R atau Cmd+R
5. **Check internet** - Must be online for Sheets sync

---

**Version**: 1.0.0
**Last Updated**: September 24, 2026
**Status**: ✅ Ready to Use

**🎉 Selamat menggunakan Sistem Absensi QR Code UIN Ar-Raniry!**
