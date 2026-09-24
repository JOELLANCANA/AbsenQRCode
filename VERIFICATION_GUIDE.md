# ✅ Verification Guide - Sistem Absensi QR Code

Panduan untuk memverifikasi bahwa sistem sudah setup dengan benar dan production-ready.

---

## 🎯 Your Deployment URL

```
https://script.google.com/a/macros/ar-raniry.ac.id/s/AKfycbxwo5WCMyLIPl9s79YbGG3UzNAYVAzCbdfjmNnoo-vWi5_BYolta2SpFQVEUUPivH8Lkg/exec
```

**Status**: ✅ DEPLOYED & ACTIVE

---

## ✅ Step-by-Step Verification

### Step 1: Open Web App (1 min)

1. Copy-paste URL ke browser baru
2. Website harus load tanpa error
3. Header hijau dengan logo UIN Ar-Raniry harus visible
4. Navigation tabs: Scan & Absen | Data Peserta | Log Riwayat | Admin & Laporan

**Expected Result**: ✅ Web app terbuka normal

---

### Step 2: Test Tab Navigation (1 min)

- [ ] Click "Scan & Absen" tab
- [ ] Click "Data Peserta" tab - harus show tabel peserta
- [ ] Click "Log Riwayat" tab - harus show log absensi
- [ ] Click "Admin & Laporan" tab - harus show login form

**Expected Result**: ✅ Semua tab responsive dan loading data

---

### Step 3: Test Camera Permission (2 min)

1. Klik tab "Scan & Absen"
2. Tunggu ~1 detik, popup akan muncul asking for camera permission

**Scenario A**: Permission popup dari browser
- Click "Allow" / "Izinkan"
- Camera preview harus muncul
- Laser animation terlihat

**Scenario B**: Modal "Izin Kamera Diperlukan"
- User belum pernah allow sebelumnya
- Modal akan show instruksi per browser
- Follow instruksi dan reload

**Scenario C**: Error message "Kamera tidak ditemukan"
- Device tidak punya camera
- **Solution**: Use manual input field (ada di bawah scanner)

**Expected Result**: ✅ Scanner bekerja ATAU fallback ke input manual

---

### Step 4: Test Manual Input (2 min)

Jika kamera bermasalah atau tidak ada, test fallback:

1. Di "Scan & Absen" tab, lihat field: "Atau Input Manual ID Peserta"
2. Type: `UIN-001`
3. Click "Cari" button
4. Card harus muncul dengan data peserta

**Card akan show**:
- Nama: Dr. Ahmad Farhan, M.Ag
- ID: UIN-001
- NIM: 198203152008011002
- Status Terakhir badge
- 3 action buttons: HADIR | KELUAR | MASUK KEMBALI

**Expected Result**: ✅ Card muncul dengan data benar

---

### Step 5: Test Status Update (2 min)

Dari participant card yang sudah muncul:

1. Click button "HADIR"
2. Toast notification harus muncul: "✓ Status [HADIR] berhasil disimpan untuk Dr. Ahmad Farhan, M.Ag"
3. Card akan hide otomatis
4. Go to "Data Peserta" tab
5. Cari baris "UIN-001"
6. Status Terakhir column harus show "HADIR"
7. Waktu Terakhir harus show timestamp terbaru

**Expected Result**: ✅ Status terupdate di tabel

---

### Step 6: Test Data Peserta Tab (1 min)

1. Click "Data Peserta" tab
2. Tabel harus show:
   - Column: ID | Nama | NIM | Kategori | Status Terakhir | Waktu Terakhir | Aksi QR
   - Minimal 3 sample peserta (UIN-001, UIN-002, UIN-003)

3. Test search: Type "Ahmad" di search field
   - Tabel harus filter dan hanya show UIN-001

4. Test QR modal: Click button dengan icon QR di "Aksi QR" column
   - Modal akan show QR Code gambar
   - Show peserta name, NIM, ID

**Expected Result**: ✅ Tabel responsive, search bekerja, QR modal works

---

### Step 7: Test Log Riwayat Tab (1 min)

1. Click "Log Riwayat" tab
2. Tabel harus show entries dari status updates sebelumnya
3. Column: No | Waktu Log | ID Peserta | Nama | NIM | Kategori | Aksi Status

4. Test search: Type "HADIR" di search field
   - Tabel harus filter entries dengan status HADIR

**Expected Result**: ✅ Log entries visible dan searchable

---

### Step 8: Test Admin Dashboard (3 min)

1. Click "Admin & Laporan" tab
2. Login form harus show dengan field: "Password Admin"

3. Test wrong password:
   - Enter: `wrongpassword`
   - Click "Masuk Dashboard"
   - Error message: "Password Admin Salah!"

4. Test correct password:
   - Enter: `adminArRaniry2026`
   - Click "Masuk Dashboard"
   - Admin dashboard harus show 3 options:
     - Kelola Data Peserta
     - Generate QR Code Drive
     - Cetak Laporan PDF

5. Test admin features:
   - Option 1: Click "Kelola Data Peserta" → show participant list
   - Option 2: Click "Generate QR Code Drive" → show success message
   - Option 3: Click "Cetak Laporan PDF" → show preview & print button

6. Click "Logout" button → back to login form

**Expected Result**: ✅ Admin auth works, all features accessible

---

### Step 9: Test Real-time Updates (2 min)

1. Open app di 2 browser tabs
2. Di tab 1: Input "UIN-002" dan click "HADIR"
3. Di tab 2: Refresh atau click "Refresh" button
4. Tab 2 harus auto-update dan show UIN-002 dengan status HADIR

**Expected Result**: ✅ Data sync real-time across devices

---

### Step 10: Test Mobile (3 min)

1. Open app URL di smartphone browser
2. UI harus responsive:
   - Header visible
   - Navigation harus be collapsible (hamburger menu)
   - Scanner harus fit dalam screen
   - Tabel scrollable

3. Test camera on mobile:
   - Camera permission prompt in mobile
   - Allow permission
   - Scanner preview harus working

4. Test status update on mobile:
   - Scan atau input manual ID
   - Click status button
   - Should work same as desktop

**Expected Result**: ✅ Mobile version fully functional

---

## 🔧 Advanced Verification

### Check Google Sheets Integration

1. Buka Google Sheet: https://docs.google.com/spreadsheets/d/11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk
2. Check sheet tabs:
   - [ ] "DataPeserta" tab ada
   - [ ] "LogAbsensi" tab ada

3. Di "DataPeserta" sheet:
   - [ ] Kolom: ID | Nama | NIM | Email | Kategori | Status | Waktu | QR URL
   - [ ] Data peserta ada (minimal 3)
   - [ ] Status column terupdate sesuai test di step 5

4. Di "LogAbsensi" sheet:
   - [ ] Kolom: No | Waktu Log | ID | Nama | NIM | Status | Kategori
   - [ ] Entries dari status updates ada

**Expected Result**: ✅ Google Sheets punya data yang benar

---

### Check Google Drive QR Codes

1. Buka Google Drive: https://drive.google.com/drive/folders/1T2KFEN5avSOW25-cUHub-ZF2U2unSpU2
2. Folder "QR_Codes_Absensi_UIN_ArRaniry" harus ada
3. QR code files harus ada di folder:
   - QR_UIN-001_Dr_Ahmad_Farhan_M_Ag.png
   - QR_UIN-002_Siti_Rahmah_S_T.png
   - QR_UIN-003_Rahmat_Hidayat.png

**Expected Result**: ✅ QR files tersimpan di Drive

---

### Check Browser Console

1. Buka web app
2. Press F12 → Console tab
3. Check untuk errors:
   - ✓ No red errors should appear
   - ✓ May see blue "info" logs (normal)
   - ✓ May see yellow "warnings" (normal)

4. If see errors:
   - Screenshot error
   - Check TROUBLESHOOTING.md

**Expected Result**: ✅ Console clean (no critical errors)

---

### Check Network Performance

1. F12 → Network tab
2. Reload page
3. Check request times:
   - [ ] Initial page load: < 2 seconds
   - [ ] Data loading: < 1 second
   - [ ] Status update: < 2 seconds

**Expected Result**: ✅ Performance good

---

## ✅ Complete Verification Checklist

### Web App Functionality
- [ ] Web app loads without errors
- [ ] All tabs navigate correctly
- [ ] Data displays in tables
- [ ] Real-time stats update

### Camera & Scanner
- [ ] Camera permission requested
- [ ] Camera preview shows (if available)
- [ ] Scanner detects QR codes
- [ ] Fallback to manual input works
- [ ] Mobile camera works

### Status Management
- [ ] Manual input finds participant
- [ ] Status update saves
- [ ] Status reflects in table
- [ ] Log entry created
- [ ] Real-time sync works

### Admin Features
- [ ] Wrong password rejected
- [ ] Correct password allows access
- [ ] Admin dashboard shows
- [ ] All admin functions work
- [ ] Logout works

### Data Integration
- [ ] Google Sheets has correct data
- [ ] Log entries saved to sheet
- [ ] Status updates persisted
- [ ] Google Drive has QR codes
- [ ] Multiple device sync works

### Browser Compatibility
- [ ] Chrome works
- [ ] Firefox works
- [ ] Safari works
- [ ] Edge works
- [ ] Mobile browsers work

### Performance
- [ ] Page load < 3 seconds
- [ ] Actions responsive < 1 second
- [ ] No console errors
- [ ] Smooth UI interactions
- [ ] Mobile performance acceptable

---

## 📊 Test Results Template

Use this to document your verification:

```
Date: ___________
Tester: ___________

Web App URL: https://script.google.com/a/macros/ar-raniry.ac.id/...

Basic Functionality:
✓ Tab Navigation: YES / NO
✓ Data Display: YES / NO
✓ Real-time Update: YES / NO

Camera & Scanner:
✓ Camera Permission: YES / NO
✓ Scanner Works: YES / NO
✓ Manual Fallback: YES / NO
✓ Mobile Camera: YES / NO

Status Management:
✓ Status Update: YES / NO
✓ Data Persisted: YES / NO
✓ Log Recorded: YES / NO

Admin Features:
✓ Login Works: YES / NO
✓ QR Generate: YES / NO
✓ Report Print: YES / NO

Data Integration:
✓ Google Sheets Sync: YES / NO
✓ Google Drive QR: YES / NO

Overall Status: ✅ WORKING / ⚠️ ISSUES

Issues Found:
1. ________________
2. ________________

Recommendations:
1. ________________
2. ________________
```

---

## 🚀 If All Tests Pass ✅

Congratulations! Sistem Anda sudah:

1. ✅ Setup dengan benar
2. ✅ Fully functional
3. ✅ Production ready
4. ✅ Integrated dengan Google Sheets & Drive
5. ✅ Ready untuk participants

**Next Steps**:
1. Share URL dengan participants
2. Create simple instruction for users
3. Monitor first usage
4. Collect feedback

---

## ⚠️ If Issues Found

1. **Check TROUBLESHOOTING.md** untuk solution
2. **Review browser console** untuk error messages
3. **Check Google Sheet access** untuk permission issues
4. **Verify all files uploaded** ke Apps Script

---

## 📞 Support Resources

| Issue | Resource |
|-------|----------|
| Camera problem | TROUBLESHOOTING.md - Camera Issues |
| Data not saving | TROUBLESHOOTING.md - Data Issues |
| UI not working | TROUBLESHOOTING.md - Frontend Issues |
| API error | TROUBLESHOOTING.md - Backend Issues |
| Setup question | SETUP_CHECKLIST.md |

---

**Last Updated**: September 24, 2026
**Status**: Verification Template Ready
**Your App**: ✅ DEPLOYED & READY
