# 🔧 Troubleshooting Guide - Sistem Absensi QR Code

Panduan komprehensif untuk menyelesaikan masalah yang mungkin terjadi saat menggunakan sistem absensi QR Code.

## 📋 Table of Contents
- [Camera & Hardware Issues](#camera--hardware-issues)
- [Google Apps Script Issues](#google-apps-script-issues)
- [Data & Spreadsheet Issues](#data--spreadsheet-issues)
- [Frontend/UI Issues](#frontendui-issues)
- [Backend/API Issues](#backendapi-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)
- [Security Issues](#security-issues)

---

## 🎥 Camera & Hardware Issues

### ❌ "Izin Kamera Ditolak"

**Error Message:**
```
⚠️ Izin Kamera Ditolak!
Buka pengaturan browser dan izinkan akses kamera
```

**Root Cause:**
- User menolak izin kamera di first time prompt
- Browser tidak punya izin untuk camera

**Solution:**

**Untuk Chrome/Edge:**
1. Klik ikon **🔒 Gemlock** di address bar
2. Klik dropdown di sebelah "Camera"
3. Ubah dari "Block" ke "Allow"
4. Muat ulang halaman (Ctrl+R / Cmd+R)

**Untuk Firefox:**
1. Klik menu hamburger (≡) → Settings
2. Privacy & Security → Permissions
3. Camera → find domain → Change to "Allow"
4. Muat ulang halaman

**Untuk Safari (iOS/macOS):**
1. Settings → Apps/Websites
2. Camera → find app → Allow

**Untuk Android Chrome:**
1. Settings → Apps & notifications → Permissions
2. Camera → Grant permission
3. Return to browser

### ❌ "Kamera Tidak Ditemukan"

**Error Message:**
```
❌ Kamera tidak ditemukan pada perangkat Anda
```

**Root Cause:**
- Hardware kamera disconnect
- Driver tidak installed
- Port USB terputus (external camera)

**Solution:**
1. **Check hardware:**
   ```bash
   # Linux: list camera devices
   ls -la /dev/video*
   
   # macOS: check USB devices
   system_profiler SPUSBDataType
   
   # Windows: Device Manager
   devmgmt.msc → Imaging devices
   ```

2. **Test camera di aplikasi lain:**
   - Buka aplikasi video call (Zoom, Skype)
   - Jika camera tidak terdeteksi di sana juga → hardware issue

3. **Restart device:**
   - Restart browser
   - Restart computer
   - Reconnect external camera

4. **Update drivers:**
   - Windows: Update camera drivers via Device Manager
   - macOS/Linux: Usually automatic

### ❌ "Kamera Sedang Digunakan Aplikasi Lain"

**Error Message:**
```
❌ Kamera sedang digunakan oleh aplikasi lain. 
Tutup aplikasi tersebut dan coba lagi.
```

**Root Cause:**
- Video call app sedang active (Zoom, Teams)
- Record app sedang running
- Device sudah open di tab/window lain

**Solution:**
1. Close video call application
2. Close all tabs dengan app yang sudah open di-browser
3. Check Task Manager untuk proses yang menggunakan camera:
   ```bash
   # macOS
   lsof -i -P -n | grep camera
   
   # Windows PowerShell
   Get-Process | where-object {$_.ProcessName -like '*camera*'}
   ```
4. Kill process jika perlu
5. Reload page

### ❌ "Spesifikasi Kamera Tidak Terpenuhi"

**Error Message:**
```
⚠️ Spesifikasi kamera tidak terpenuhi, mencoba dengan setting default...
```

**Root Cause:**
- Browser request untuk HD resolution (1280x720)
- Device camera hanya support lower resolution
- Browser version terlalu old

**Solution:**
- **Automatic**: Sistem akan retry dengan default setting
- **Manual**: Update browser ke versi terbaru
- **Alternative**: Gunakan input manual mode

### ❌ "NotAllowedError in Android/iOS"

**Error Message:**
```
❌ Izin Kamera Ditolak! 
(NotAllowedError at getUserMedia)
```

**Root Cause:**
- Device permission belum diberikan
- Browser setting restrict camera

**Solution untuk Android:**
1. Settings → Apps → [Browser Name]
2. Permissions → Camera → Allow
3. Also check: Microphone → Allow
4. Close browser completely (swipe away)
5. Reopen browser and try again

**Solution untuk iOS:**
1. Settings → [Browser Name]
2. Camera → Allow
3. Microphone → Allow
4. Close browser (swipe up from home)
5. Reopen and try again

---

## 📱 Google Apps Script Issues

### ❌ "Error: Spreadsheet tidak ditemukan"

**Error Message:**
```
Gagal membuka Spreadsheet ID: 11q7bt212H_-l-...
Pastikan ID benar dan akun memiliki izin akses.
```

**Root Cause:**
- SPREADSHEET_ID salah di Code.gs
- Akun GAS tidak punya akses ke Sheets
- Sheets sudah didelete

**Solution:**

1. **Verify Spreadsheet ID:**
   ```javascript
   // Di Code.gs, check ID:
   const SPREADSHEET_ID = '11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk';
   // Extract dari URL:
   // https://docs.google.com/spreadsheets/d/[ID]/edit
   ```

2. **Test akses:**
   - Buka URL sheet di browser
   - Jika error: "Access denied" → need to share sheet
   - Share dengan akun Google yang mengrun Apps Script

3. **Fix akses:**
   - Buka Sheet
   - Click Share button
   - Tambahkan email: `your-email@gmail.com`
   - Give Edit access
   - Copy link & send to GAS execution user

### ❌ "Cannot read property 'getByName' of undefined"

**Error Message:**
```
TypeError: Cannot read property 'getByName' of undefined
at getActiveSS (Code.gs:15:20)
```

**Root Cause:**
- getActiveSS() return null
- SpreadsheetApp tidak initialized
- Script tidak terhubung ke Sheet

**Solution:**

1. **Verify container binding:**
   - Di Apps Script editor: Project Settings
   - Check "Script is bound to container"
   - If not → need to bind atau use SPREADSHEET_ID

2. **Use SPREADSHEET_ID fallback:**
   ```javascript
   // Ensure SPREADSHEET_ID ada di Code.gs:
   const SPREADSHEET_ID = '11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk';
   
   // Try call getActiveSS()
   let ss = getActiveSS();
   ```

3. **Initialize sheets:**
   - Di Apps Script editor: Run setupSheet()
   - Check execution log untuk error detail

### ❌ "Authorization Required"

**Error Message:**
```
Authorization required. 
This app requires access to your Google Account.
```

**Root Cause:**
- First time deploy, need to authorize
- Account permissions tidak granted

**Solution:**

1. **First time deploy:**
   - Deploy → will show "Authorize" button
   - Click button
   - Select account
   - Review permissions
   - Click Allow

2. **Permission denied later:**
   - Apps Script Editor → Review Permissions
   - May need to re-authorize with same account

3. **Fix authorization:**
   - Remove user & re-add (in Share settings)
   - Or: Create new deployment

### ❌ "Function Not Found"

**Error Message:**
```
Error: Service error: Apps Script project getParticipantsData not found
```

**Root Cause:**
- Function name salah di frontend call
- Function belum di-save di Code.gs
- Wrong file uploaded

**Solution:**

1. **Check function names:**
   ```javascript
   // Di Code.gs harus ada function:
   function getParticipantsData() { ... }
   function findParticipantById(id) { ... }
   function updateParticipantStatus(id, status) { ... }
   function importParticipantsBatch(array) { ... }
   function verifyAdminLogin(password) { ... }
   function generateQRCodesToDrive() { ... }
   function setupSheet() { ... }
   ```

2. **Save all changes:**
   - Ctrl+S di Code.gs
   - Wait sampai "Saved" indicator hilang

3. **Re-deploy:**
   - Deploy → New Deployment
   - Type: Web App
   - Click Deploy

### ❌ "google.script.run is undefined"

**Error Message:**
```
ReferenceError: google is not defined
at HTMLDocument.<anonymous> (Index:250:20)
```

**Root Cause:**
- Not running in Google Apps Script environment
- Running di local atau browser tanpa GAS context

**Solution:**

1. **Check environment:**
   ```javascript
   if (typeof google !== 'undefined') {
     console.log('Running in GAS');
   } else {
     console.log('Running elsewhere (local/Vercel)');
   }
   ```

2. **Use gapps-sync.js wrapper:**
   ```javascript
   // Instead of direct google.script.run:
   // Use wrapper yang auto-detect:
   await callGetParticipantsData();
   ```

3. **For local dev:**
   - Use mock data atau Vercel backend
   - Set `API_BASE_URL` di window object

---

## 📊 Data & Spreadsheet Issues

### ❌ "Sheet not found: DataPeserta"

**Error Message:**
```
Error: Sheet DataPeserta tidak ditemukan
```

**Root Cause:**
- Sheet belum dibuat
- Nama sheet salah (case sensitive!)
- Wrong spreadsheet opened

**Solution:**

1. **Verify sheets exist:**
   - Buka Google Sheet
   - Check tab names: `DataPeserta`, `LogAbsensi`
   - If not: Add new sheet with correct name

2. **Verify sheet structure:**
   ```
   DataPeserta columns:
   A: ID Peserta
   B: Nama Lengkap
   C: NIM / NIP / Instansi
   D: Email
   E: Kategori
   F: Status Terakhir
   G: Waktu Terakhir
   H: URL QR Code
   
   LogAbsensi columns:
   A: No Log
   B: Waktu Log
   C: ID Peserta
   D: Nama Peserta
   E: NIM / NIP
   F: Aksi Status
   G: Kategori Peserta
   ```

3. **Auto-setup:**
   - Run `setupSheet()` di Apps Script editor
   - Will create sheets if not exist

### ❌ "Data tidak tersimpan setelah update status"

**Error Message:**
```
Success toast muncul, tapi data di sheet tidak berubah
```

**Root Cause:**
- Permission error saat write
- Wrong sheet reference
- Update ke row yang salah

**Solution:**

1. **Check permissions:**
   - Verify akun punya Edit access ke Sheet

2. **Check execution log:**
   - Apps Script Editor → Execution log
   - See actual error message

3. **Manual test:**
   ```javascript
   // Di Code.gs, run test:
   function testUpdateStatus() {
     let ss = getActiveSS();
     let sheet = ss.getSheetByName('DataPeserta');
     sheet.getRange(2, 6).setValue('TEST');  // Set cell F2 to TEST
     // Check Google Sheet - should update
   }
   ```

4. **Check formula conflicts:**
   - If column punya formula
   - Update might overwrite formula
   - Remove formula atau change approach

### ❌ "Excel import tidak bekerja - data tidak masuk"

**Error Message:**
```
Upload success tapi data tidak muncul di sheet
```

**Root Cause:**
- Excel format tidak sesuai
- Missing required columns
- File encoding issue

**Solution:**

1. **Check Excel format:**
   - Must have columns: id, nama, nim, email, kategori
   - No extra columns at start
   - First row = header

   **Example Excel format:**
   ```
   id          | nama            | nim        | email              | kategori
   UIN-001     | Ahmad Farhan    | 1982031... | ahmad@ar-raniry... | Dosen
   UIN-002     | Siti Rahmah     | 2001030... | siti@student...    | Mahasiswa
   ```

2. **Test dengan simpler file:**
   - Create test Excel dengan 2-3 rows
   - Try import
   - Check if works

3. **Check console log:**
   - F12 → Console
   - See actual error dari import process

### ❌ "QR Code tidak generate ke Drive"

**Error Message:**
```
Success tapi QR files tidak ada di Google Drive
```

**Root Cause:**
- Drive folder tidak exist
- Permission error
- API quota exceed

**Solution:**

1. **Check Drive folder:**
   - Buka Google Drive
   - Search folder: `QR_Codes_Absensi_UIN_ArRaniry`
   - If not exist: akan auto-create (check sharing permission)

2. **Check permission:**
   ```javascript
   // Test di Code.gs:
   function testDriveAccess() {
     let folders = DriveApp.getFoldersByName('QR_Codes_Absensi_UIN_ArRaniry');
     if (folders.hasNext()) {
       let folder = folders.next();
       Logger.log('Folder found: ' + folder.getUrl());
     } else {
       Logger.log('Folder not found or no permission');
     }
   }
   ```

3. **Check API quota:**
   - If generating many QR at once → might hit quota
   - Wait and retry later
   - Or generate in batches

4. **Verify Drive FOLDER_ID:**
   ```javascript
   const DRIVE_FOLDER_ID = '1T2KFEN5avSOW25-cUHub-ZF2U2unSpU2';
   // Make sure ini correct dari URL:
   // https://drive.google.com/drive/folders/[ID]
   ```

---

## 🎨 Frontend/UI Issues

### ❌ "Scanner tidak tampil atau black screen"

**Error Message:**
```
Reader div appears black/empty
No camera stream visible
```

**Root Cause:**
- Camera permission belum diberikan
- Camera access denied
- Browser support issue

**Solution:**

1. **Check permission:**
   - Check ada popover asking camera permission
   - Grant permission di browser settings

2. **Check browser support:**
   - Must use modern browser: Chrome, Firefox, Safari, Edge
   - IE11 tidak support
   - Update browser ke latest version

3. **Check console errors:**
   - F12 → Console
   - Look for: NotAllowedError, NotFoundError, NotReadableError
   - See CAMERA ISSUES section for specific error

### ❌ "QR Scanner tidak detect barcode"

**Error Message:**
```
Scanner running tapi QR Code tidak detect
```

**Root Cause:**
- QR code kualitas buruk
- Camera focus issue
- Distance terlalu jauh/dekat
- Code kecil

**Solution:**

1. **QR Code quality:**
   - Print dengan resolusi tinggi
   - Ensure tidak ada damage/wrinkle
   - Black dan white contrast jelas

2. **Distance & focus:**
   - Hold at ~10-15cm distance
   - Make sure in focus
   - Direct light (tidak backlit)

3. **Size:**
   - QR code minimal ~2cm x 2cm
   - Lebih besar → easier detect

4. **Test dengan online generator:**
   - Generate QR di quickchart.io
   - Display di screen dan scan
   - If work → problem dengan printed QR

5. **Alternative barcode formats:**
   - Ubah ke CODE128 atau barcode lain
   - Edit html5-qrcode config di camera-handler.js:
   ```javascript
   formatsToSupport: [
     Html5QrcodeSupportedFormats.CODE_128,
     Html5QrcodeSupportedFormats.EAN_13
   ]
   ```

### ❌ "Tab switch membuat scanner crash"

**Error Message:**
```
Scanner stop working setelah switch tab
Atau: Scanner running di background menghabiskan battery
```

**Root Cause:**
- Browser pause resource saat tab tidak active
- Scanner tidak properly stopped

**Solution:**

1. **Implement pause logic:**
   ```javascript
   // In switchTab() function:
   if (tabId === 'beranda') {
     startQrScanner();
   } else {
     stopQrScanner();  // Stop saat switch away
   }
   ```

2. **Check index.html sudah implement:**
   - Find switchTab() function
   - Ensure call stopQrScanner() untuk non-beranda tabs

3. **Battery optimization:**
   - Scanner auto-stop kalau tab not active
   - Will resume saat back ke tab

### ❌ "UI unresponsive / freezing"

**Error Message:**
```
Clicking buttons tidak response
UI terasa lag
```

**Root Cause:**
- Too much data rendering
- Large Excel import
- Network timeout

**Solution:**

1. **Check data size:**
   - If > 1000 participants
   - Implement pagination atau virtual scrolling

2. **Optimize rendering:**
   - Don't render all logs di live feed
   - Limit to last 50
   - Lazy load saat scroll

3. **Async operations:**
   - Large import harus async
   - Show progress indicator

4. **Clear cache:**
   - Ctrl+Shift+Delete → Clear cache
   - Close browser
   - Reopen

---

## 🔌 Backend/API Issues

### ❌ Vercel: "CORS error in console"

**Error Message:**
```
Access to XMLHttpRequest at 'https://api.vercel.app/...' 
from origin 'https://myapp.com' has been blocked by CORS policy
```

**Root Cause:**
- Frontend domain tidak di-whitelist
- CORS_ORIGIN tidak configured

**Solution:**

1. **Update Vercel environment:**
   - Vercel Dashboard → Settings → Environment Variables
   - Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://yourdomain.com
   ```
   - Or untuk multiple domains:
   ```
   CORS_ORIGIN=https://yourdomain.com,http://localhost:3000
   ```

2. **Redeploy:**
   - Vercel auto-redeploy saat env change
   - Or manual redeploy dari Deployments tab

3. **Test locally:**
   ```bash
   cd vercel-backend
   npm run dev
   # Test dengan curl
   curl -H "Origin: http://localhost:3000" http://localhost:3000/api/health
   ```

### ❌ Vercel: "Port 3000 already in use"

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Root Cause:**
- Port 3000 still running dari process sebelumnya
- Multiple npm dev processes

**Solution:**

**Linux/macOS:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or kill all node processes
pkill -f "node"
```

**Windows PowerShell:**
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F

# Or kill all node
taskkill /F /IM node.exe
```

### ❌ Vercel: "Cannot find module 'express'"

**Error Message:**
```
Error: Cannot find module 'express'
```

**Root Cause:**
- package.json ada tapi node_modules belum install
- vercel.json config salah

**Solution:**

```bash
# Install dependencies
npm install

# Verify installed
ls node_modules | grep express

# Test locally
npm run dev

# Deploy
vercel
```

### ❌ API: "404 endpoint not found"

**Error Message:**
```
{
  "success": false,
  "message": "Route /api/xyz tidak ditemukan"
}
```

**Root Cause:**
- Frontend call endpoint yang tidak exist
- Typo dalam URL
- Method salah (GET vs POST)

**Solution:**

1. **Check available endpoints:**
   - GET /api/health
   - GET /api/participants
   - GET /api/participants/:id
   - POST /api/participants/:id/status
   - POST /api/participants/batch
   - POST /api/admin/login
   - POST /api/qrcodes/generate

2. **Verify call:**
   ```javascript
   // Check gapps-sync.js
   // Make sure URL correct dan method match
   ```

3. **Test dengan curl:**
   ```bash
   curl -X GET http://localhost:3000/api/participants
   curl -X POST http://localhost:3000/api/participants/UIN-001/status \
     -H "Content-Type: application/json" \
     -d '{"statusType":"HADIR"}'
   ```

---

## 🚀 Deployment Issues

### ❌ "Apps Script Web App not loading"

**Error Message:**
```
Blank page or error saat buka URL deployment
```

**Root Cause:**
- Code.gs error saat load
- Index.html tidak found
- Wrong file names

**Solution:**

1. **Check file names (case sensitive):**
   - Script file: harus named `Code`
   - HTML file: harus named `Index`
   - Exact spelling!

2. **Check doGet() function:**
   ```javascript
   // Di Code.gs harus ada:
   function doGet(e) {
     const template = HtmlService.createTemplateFromFile('Index');
     return template.evaluate()
       .setTitle('Sistem Absensi QR Code - UIN Ar-Raniry')
       .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
       .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
   }
   ```

3. **Check execution log:**
   - Apps Script Editor → Execution log
   - See actual error

4. **Re-deploy:**
   - New Deployment
   - Web app
   - Deploy

### ❌ "Vercel deployment stuck"

**Error Message:**
```
Deployment in progress... atau error: build failed
```

**Root Cause:**
- Build process timeout
- Missing dependencies
- Environment variables not set

**Solution:**

1. **Check build logs:**
   - Vercel Dashboard → Deployments → [Deployment] → Logs
   - See actual error

2. **Install dependencies locally first:**
   ```bash
   npm install
   npm run dev  # Test locally
   ```

3. **Set env variables before deploy:**
   - Vercel Dashboard → Settings → Environment Variables
   - Add semua dari .env.example

4. **Retry deployment:**
   ```bash
   vercel --prod
   ```

### ❌ "After deploy, API returns 502 Bad Gateway"

**Error Message:**
```
502: Bad Gateway
```

**Root Cause:**
- Backend crash di Vercel
- Memory limit exceed
- Syntax error di index.js

**Solution:**

1. **Check server logs:**
   - Vercel Dashboard → Logs
   - See error detail

2. **Test locally:**
   ```bash
   npm run dev
   # Should start without error
   ```

3. **Check for syntax errors:**
   ```bash
   node -c index.js  # Validate syntax
   ```

4. **Check memory usage:**
   - If large data processing
   - Implement chunking/streaming
   - Or upgrade Vercel plan

5. **Redeploy:**
   ```bash
   vercel --prod --force
   ```

---

## ⚡ Performance Issues

### ❌ "App terasa slow / lag"

**Root Cause:**
- Large dataset rendering
- Network latency
- Unoptimized queries

**Solution:**

1. **Limit data displayed:**
   ```javascript
   // Don't render ALL logs
   // Render last 50 only
   const recentLogs = logsList.slice(0, 50);
   ```

2. **Implement virtual scrolling:**
   - For large tables
   - Only render visible rows

3. **Optimize database queries:**
   - Filter di backend, bukan frontend
   - Paginate results

4. **Use caching:**
   ```javascript
   let cachedData = null;
   let cacheExpiry = null;
   
   function getCachedParticipants() {
     if (cachedData && Date.now() < cacheExpiry) {
       return cachedData;  // Return cache
     }
     // Fetch fresh data
   }
   ```

### ❌ "Network requests timeout"

**Error Message:**
```
Timeout error / Request takes too long
```

**Root Cause:**
- Large file upload
- Slow network
- Server processing slow

**Solution:**

1. **Set timeout:**
   ```javascript
   // In gapps-sync.js
   const controller = new AbortController();
   const timeout = setTimeout(() => controller.abort(), 30000); // 30 sec
   
   const response = await fetch(url, { signal: controller.signal });
   ```

2. **Show progress:**
   - For long operations
   - User knows system still working

3. **Optimize data size:**
   - Compress data
   - Reduce columns transferred

---

## 🔒 Security Issues

### ❌ "Admin password exposed in console"

**Issue:**
```javascript
// BAD: Password in console.log
console.log('Password:', password);
```

**Solution:**
```javascript
// GOOD: Don't log sensitive data
if (debugMode) {
  console.log('Password submitted');  // Don't log actual value
}
```

### ❌ "CSV/Excel contains sensitive data"

**Issue:**
- Export logs dengan personal data
- Unencrypted files

**Solution:**
1. Limit export ke authorized users
2. Use HTTPS untuk download
3. Encrypt file kalau needed
4. Delete exports setelah use

### ❌ "CORS origin tidak restricted"

**Issue:**
```javascript
// BAD: Allow all origins
app.use(cors({ origin: '*' }));
```

**Solution:**
```javascript
// GOOD: Restrict to known origins
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
```

---

## 📞 Getting Help

Jika issue tidak tercantum:

1. **Check console log:**
   ```
   Browser: F12 → Console tab
   Apps Script: Execution log
   Vercel: Dashboard → Logs
   ```

2. **Enable debug mode:**
   ```javascript
   localStorage.setItem('debug', 'true');
   location.reload();
   ```

3. **Check documentation:**
   - DEPLOYMENT_GUIDE.md
   - INTEGRATION_GUIDE.md
   - Code comments

4. **Test step-by-step:**
   - Test camera separately
   - Test scanner separately
   - Test API separately
   - Then integration

5. **Isolate the problem:**
   - GAS issue? Test di Apps Script editor
   - Frontend issue? Test di browser console
   - API issue? Test dengan curl/Postman
   - Data issue? Check Google Sheet directly

---

## 🎯 Quick Diagnostic Checklist

```
Camera Issues:
☐ Camera permission given di browser
☐ Camera device working (test di Zoom/Teams)
☐ Browser support modern features
☐ No other app using camera

GAS Issues:
☐ SPREADSHEET_ID correct
☐ Sheet named "DataPeserta" dan "LogAbsensi"
☐ Code.gs semua function ada
☐ Deployed sebagai Web App
☐ Authorization granted

Data Issues:
☐ Sheet structure correct
☐ Data format valid
☐ Spreadsheet access permission OK
☐ Drive folder exists dan accessible

Frontend Issues:
☐ All .js files loaded
☐ Script order correct
☐ No console errors
☐ Browser cache cleared

Backend Issues:
☐ Dependencies installed
☐ .env file setup
☐ Server running (localhost:3000)
☐ API endpoints accessible
☐ CORS configured

Deployment Issues:
☐ File names correct (case sensitive)
☐ appsscript.json valid
☐ Vercel env variables set
☐ All files committed to git
☐ Build successful
```

---

**Last Updated**: September 24, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
