# ✅ Setup Checklist - Sistem Absensi QR Code

Panduan step-by-step untuk setup lengkap sistem dari nol hingga production ready.

## 📋 Pre-Setup Requirements

- [ ] Google Account (untuk Google Apps Script & Drive)
- [ ] Google Sheet yang sudah dibuat: https://docs.google.com/spreadsheets/d/11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk
- [ ] Google Drive Folder: https://drive.google.com/drive/folders/1T2KFEN5avSOW25-cUHub-ZF2U2unSpU2
- [ ] Browser modern (Chrome, Firefox, Safari, atau Edge)
- [ ] Text editor (VS Code recommended)

---

## 🔧 PHASE 1: Prepare Files Locally

### Step 1.1: Create Project Folder
```bash
mkdir absensi-system
cd absensi-system
```

### Step 1.2: Create File Structure
```
absensi-system/
├── Code.gs
├── Index.html
├── camera-handler.js
├── gapps-sync.js
├── appsscript.json
├── DEPLOYMENT_GUIDE.md
├── INTEGRATION_GUIDE.md
├── TROUBLESHOOTING.md
├── SETUP_CHECKLIST.md
└── vercel-backend/
    ├── index.js
    ├── package.json
    ├── vercel.json
    ├── .env.example
    └── README.md
```

### Step 1.3: Prepare Files
- [ ] Copy `Code.gs` content dari dokumentasi
- [ ] Copy `Index.html` content dari dokumentasi
- [ ] Copy `camera-handler.js` content
- [ ] Copy `gapps-sync.js` content
- [ ] Copy `appsscript.json` content

### Step 1.4: Verify IDs
- [ ] Update `SPREADSHEET_ID` di Code.gs:
  ```
  Dari URL: https://docs.google.com/spreadsheets/d/11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk
  Ambil bagian yang bold: 11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk
  ```

- [ ] Update `DRIVE_FOLDER_ID` di Code.gs:
  ```
  Dari URL: https://drive.google.com/drive/folders/1T2KFEN5avSOW25-cUHub-ZF2U2unSpU2
  Ambil bagian yang bold: 1T2KFEN5avSOW25-cUHub-ZF2U2unSpU2
  ```

---

## 📱 PHASE 2: Setup Google Apps Script

### Step 2.1: Open Google Apps Script Editor
- [ ] Buka Google Sheet: https://docs.google.com/spreadsheets/d/11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk
- [ ] Menu → **Extensions** → **Apps Script**
- [ ] New tab terbuka dengan editor

### Step 2.2: Upload Code.gs
- [ ] Di sidebar, rename "Code.gs" atau create new script file named `Code`
- [ ] Copy-paste seluruh isi `Code.gs`
- [ ] **Save** (Ctrl+S)
- [ ] Verify di console: tidak ada error

### Step 2.3: Upload Index.html
- [ ] Click **+ > Create new file > Html**
- [ ] Name: `Index`
- [ ] Copy-paste isi `Index.html`
- [ ] **Save** (Ctrl+S)

### Step 2.4: Upload camera-handler.js
- [ ] Click **+ > Create new file > Script**
- [ ] Name: `CameraHandler`
- [ ] Copy-paste isi `camera-handler.js`
- [ ] **Save** (Ctrl+S)

### Step 2.5: Upload gapps-sync.js
- [ ] Click **+ > Create new file > Script**
- [ ] Name: `GAppsSync`
- [ ] Copy-paste isi `gapps-sync.js`
- [ ] **Save** (Ctrl+S)

### Step 2.6: Configure appsscript.json
- [ ] Click Project Settings (⚙️ icon di sidebar)
- [ ] Scroll down, enable: **"Show 'appsscript.json' manifest file in editor"**
- [ ] Click file `appsscript.json` di sidebar
- [ ] Copy-paste isi `appsscript.json`
- [ ] **Save** (Ctrl+S)

### Step 2.7: Verify All Files
- [ ] Sidebar menunjukkan 5 files: Code, Index, CameraHandler, GAppsSync, appsscript.json
- [ ] No syntax errors di console
- [ ] All files saved

### Step 2.8: Test Setup Sheet Function
- [ ] Di editor, select function dropdown → `setupSheet`
- [ ] Click ▶️ **Run** button
- [ ] Check execution log (should see success message)
- [ ] Verify di Google Sheet: `DataPeserta` dan `LogAbsensi` tabs ada

### Step 2.9: Deploy as Web App
- [ ] Click **Deploy** button (top right)
- [ ] Select **New Deployment**
- [ ] Type: `Web app`
- [ ] Execute as: `Your Email`
- [ ] Access: `Anyone`
- [ ] Click **Deploy**
- [ ] Copy deployment URL (looks like: https://script.google.com/macros/d/[ID]/usercache/[VERSION]/)
- [ ] **SAVE THIS URL** - ini adalah app Anda!

### Step 2.10: Authorization
- [ ] Jika prompt untuk authorize:
  - [ ] Click link
  - [ ] Select your account
  - [ ] Review permissions
  - [ ] Click "Allow"

---

## 🌐 PHASE 3: Test Web App

### Step 3.1: Open Web App
- [ ] Paste deployment URL ke browser
- [ ] Web app should load

### Step 3.2: Test Basic Features
- [ ] Sidebar navigation bekerja
- [ ] Tab "Scan & Absen" muncul
- [ ] Tab "Data Peserta" menunjukkan 3 sample data
- [ ] Tab "Log Riwayat" loading

### Step 3.3: Test Camera
- [ ] Di "Scan & Absen" tab
- [ ] Check: ada modal "Izin Kamera Diperlukan"?
  - [ ] YES: Give permission di browser
  - [ ] NO: Camera already authorized
- [ ] Scanner harus menunjukkan camera preview
- [ ] Laser animation harus terlihat

### Step 3.4: Test Manual Input
- [ ] Input "UIN-001" di manual input field
- [ ] Click "Cari"
- [ ] Card harus muncul dengan data peserta
- [ ] 3 action buttons: HADIR, KELUAR, MASUK KEMBALI harus muncul

### Step 3.5: Test Status Update
- [ ] Click "HADIR" button
- [ ] Success toast harus muncul
- [ ] Go to "Data Peserta" tab
- [ ] Verify: UIN-001 status berubah ke "HADIR"
- [ ] Refresh (Click "Refresh" button)
- [ ] Data harus persistent

### Step 3.6: Test Admin Login
- [ ] Go to "Admin & Laporan" tab
- [ ] Enter password: `adminArRaniry2026`
- [ ] Click "Masuk Dashboard"
- [ ] Admin dashboard harus visible
- [ ] Click "Logout" dan verify kembali ke login

### Step 3.7: Test Data Operations
- [ ] Test Upload Excel: Click "Upload Excel" button
  - [ ] Select sample Excel file
  - [ ] Click "Impor & Generate QR"
  - [ ] Check success message
- [ ] Test Generate QR: Click "Generate QR Code Drive"
  - [ ] Should show success
  - [ ] Check Google Drive folder untuk QR files
- [ ] Test Print: Click "Cetak Kartu Peserta"
  - [ ] Print preview should show ID cards

---

## ☁️ PHASE 4: Setup Vercel Backend (Optional)

**Skip this phase jika ingin pakai Google Apps Script saja. Hanya untuk advanced users yang ingin scalable backend.**

### Step 4.1: Prepare Backend Files
- [ ] Create folder: `vercel-backend`
- [ ] Copy files:
  - [ ] `package.json`
  - [ ] `vercel.json`
  - [ ] `.env.example`
  - [ ] `index.js`
  - [ ] `README.md`

### Step 4.2: Setup Local Development
- [ ] Open terminal di `vercel-backend` folder
- [ ] Run: `npm install`
- [ ] Copy `.env.example` → `.env`
- [ ] Update `.env` dengan credentials:
  ```
  SPREADSHEET_ID=11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk
  DRIVE_FOLDER_ID=1T2KFEN5avSOW25-cUHub-ZF2U2unSpU2
  ADMIN_PASSWORD=adminArRaniry2026
  ```

### Step 4.3: Test Backend Locally
- [ ] Run: `npm run dev`
- [ ] Open browser: `http://localhost:3000/api/health`
- [ ] Should see: `{"success": true, "data": {"status": "OK", ...}}`
- [ ] Verify Ctrl+C untuk stop server

### Step 4.4: Deploy to Vercel
- [ ] Push to GitHub (or create git repo):
  ```bash
  git init
  git add .
  git commit -m "Initial backend"
  git push origin main
  ```
- [ ] Buka https://vercel.com
- [ ] Import project dari GitHub
- [ ] Set Environment Variables:
  - [ ] `SPREADSHEET_ID`
  - [ ] `DRIVE_FOLDER_ID`
  - [ ] `ADMIN_PASSWORD`
  - [ ] `CORS_ORIGIN=*`
- [ ] Deploy

### Step 4.5: Update Frontend (Optional)
**Hanya jika sudah deploy ke Vercel**

- [ ] Di Google Apps Script Index.html, tambahkan:
  ```html
  <script>
    window.API_BASE_URL = 'https://your-vercel-domain.vercel.app/api';
  </script>
  ```
- [ ] Redeploy Apps Script
- [ ] Test API calls

---

## 📊 PHASE 5: Production Verification

### Step 5.1: Check All Endpoints
- [ ] GET /api/participants → Returns data
- [ ] GET /api/participants/UIN-001 → Returns specific peserta
- [ ] POST /api/participants/:id/status → Update works
- [ ] POST /api/admin/login → Auth works

### Step 5.2: Security Check
- [ ] Admin password tidak hardcoded di frontend ✓
- [ ] CORS configured properly ✓
- [ ] HTTPS enabled (Vercel auto) ✓
- [ ] Environment variables not committed ✓

### Step 5.3: Performance Check
- [ ] Load time < 3 seconds
- [ ] Scanner responds < 1 second
- [ ] Status update < 2 seconds
- [ ] No console errors

### Step 5.4: Data Backup
- [ ] Download Google Sheet as backup
- [ ] Download QR codes dari Drive
- [ ] Setup regular backup schedule

### Step 5.5: User Testing
- [ ] Test dengan minimal 5 pengguna
- [ ] Test dari berbagai devices
- [ ] Test dari berbagai browsers
- [ ] Collect feedback

---

## 🚀 PHASE 6: Go Live

### Step 6.1: Share URL
- [ ] Copy deployment URL
- [ ] Share dengan participants
- [ ] Provide simple instructions:
  ```
  1. Buka link: [URL]
  2. Allow akses kamera
  3. Scan QR code milik Anda
  4. Pilih status: HADIR / KELUAR / MASUK KEMBALI
  5. Selesai!
  ```

### Step 6.2: Test During Event
- [ ] Monitor real-time activity
- [ ] Check "Live Activity Feed" untuk status updates
- [ ] Check error logs

### Step 6.3: Post-Event
- [ ] Download log riwayat
- [ ] Print laporan
- [ ] Collect feedback
- [ ] Plan improvements

---

## 📝 Post-Setup Maintenance

### Regular Tasks:
- [ ] Daily: Check for errors, monitor logs
- [ ] Weekly: Backup data
- [ ] Monthly: Review performance, update if needed
- [ ] Quarterly: Security review

### Update Checklist:
- [ ] Keep browser updated
- [ ] Keep Node.js updated (if using Vercel)
- [ ] Monitor Google API quotas
- [ ] Review admin logs

---

## 📞 Quick Reference

**Web App URL:**
```
https://script.google.com/macros/d/[ID]/usercache/[VERSION]/
```

**Credentials:**
- Admin Password: `adminArRaniry2026`
- Spreadsheet: https://docs.google.com/spreadsheets/d/11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk
- Drive: https://drive.google.com/drive/folders/1T2KFEN5avSOW25-cUHub-ZF2U2unSpU2

**Contact Info:**
- Issue? Check: TROUBLESHOOTING.md
- Integration help? Check: INTEGRATION_GUIDE.md
- Deploy help? Check: DEPLOYMENT_GUIDE.md

---

**Last Updated**: September 24, 2026
**Status**: ✓ Production Ready
**Version**: 1.0.0
