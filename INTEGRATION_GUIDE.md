# 🔗 Integration Guide - Sistem Absensi QR Code

Panduan lengkap untuk mengintegrasikan semua komponen sistem dan menyelaraskan komunikasi antara Google Apps Script, Frontend, dan Vercel Backend.

## 📋 Daftar Isi
1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Google Apps Script Integration](#google-apps-script-integration)
4. [Frontend Integration](#frontend-integration)
5. [Vercel Backend Integration](#vercel-backend-integration)
6. [Communication Flow](#communication-flow)
7. [Common Issues & Solutions](#common-issues--solutions)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (index.html)                    │
│  - UI Interface                                              │
│  - QR Scanner (camera-handler.js)                            │
│  - Data Visualization                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌────────┐  ┌──────────┐  ┌──────────┐
   │ GAS    │  │ Vercel   │  │ Local    │
   │ Apps   │  │ Backend  │  │ API      │
   │Script  │  │ (Node.js)│  │ (Dev)    │
   └────────┘  └──────────┘  └──────────┘
        │            │            │
        └────────────┼────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
  ┌─────────────────────────┐  ┌────────┐
  │   Google Sheets         │  │ Google │
  │  (Data Storage)         │  │ Drive  │
  │                         │  │ (QR)   │
  └─────────────────────────┘  └────────┘
```

### Mode Operasional

**Mode 1: Google Apps Script (Rekomendasi untuk Prod)**
- Frontend langsung berkomunikasi dengan Code.gs via `google.script.run`
- Data disimpan di Google Sheets
- Tidak perlu backend terpisah
- Cocok untuk: Institutional deployments

**Mode 2: Vercel Backend (Scalable)**
- Frontend berkomunikasi ke Vercel API
- API mengelola Google Sheets via Google API
- Better performance & monitoring
- Cocok untuk: Large scale, many concurrent users

**Mode 3: Local Development**
- Frontend + Backend + Mock data semua di local
- Untuk development & testing
- Tidak butuh Google credentials

---

## 📁 File Structure

```
ABSENSI/
├── Code.gs                          # Google Apps Script backend
├── Index.html                       # Frontend UI (template)
├── camera-handler.js                # Camera & QR scanner logic
├── gapps-sync.js                    # Communication layer
├── appsscript.json                  # GAS configuration
├── DEPLOYMENT_GUIDE.md              # Deployment instructions
├── INTEGRATION_GUIDE.md             # This file
├── TROUBLESHOOTING.md               # Common issues & fixes
│
└── vercel-backend/                  # Optional Vercel backend
    ├── index.js                     # Express server
    ├── package.json                 # Node dependencies
    ├── vercel.json                  # Vercel config
    ├── .env.example                 # Environment template
    └── README.md                    # Backend docs
```

---

## 🔗 Google Apps Script Integration

### 1. File Sync Setup

Di Google Apps Script editor, pastikan struktur file:

```
Project
├── Code (GAS backend) - dari Code.gs
├── Index (HTML frontend) - dari Index.html
├── CameraHandler (JS) - dari camera-handler.js
├── GAppsSync (JS) - dari gapps-sync.js
└── appsscript.json (config) - dari appsscript.json
```

### 2. How It Works

```javascript
// Di frontend (index.html), panggil:
google.script.run
  .withSuccessHandler(successCallback)
  .withFailureHandler(errorCallback)
  .functionNameInCodeGs(param1, param2);

// Contoh:
google.script.run
  .withSuccessHandler(onParticipantsLoaded)
  .withFailureHandler(onApiError)
  .getParticipantsData();
```

### 3. GAppsSync Wrapper Layer

`gapps-sync.js` menyediakan abstraksi yang kompatibel dengan GAS dan Vercel:

```javascript
// Call ini otomatis detect environment
// Jika GAS: gunakan google.script.run
// Jika Vercel: gunakan fetch API
await callGetParticipantsData();
await callUpdateParticipantStatus(id, status);
await callImportParticipantsBatch(data);
```

### 4. Required Functions in Code.gs

Semua function ini harus ada di `Code.gs`:

```javascript
function doGet(e)                              // Entry point web app
function getActiveSS()                         // Get spreadsheet
function getParticipantsData()                 // Get all data
function findParticipantById(id)               // Find participant
function updateParticipantStatus(id, status)   // Update status
function importParticipantsBatch(array)        // Import batch
function verifyAdminLogin(password)            // Check password
function generateQRCodesToDrive()              // Gen QR codes
function setupSheet()                          // Initialize sheets
function formatDate(date)                      // Date formatter
```

---

## 🎨 Frontend Integration

### 1. Script Loading Order

Di `Index.html`, pastikan order loading:

```html
<!-- 1. Libraries terlebih dahulu -->
<script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

<!-- 2. Custom scripts dalam urutan -->
<script>
  // Inline untuk gapps-sync.js initialization
  window.API_BASE_URL = '...';
</script>

<!-- 3. Load actual script files -->
<script src="camera-handler.js"></script>
<script src="gapps-sync.js"></script>

<!-- 4. Main app initialization -->
<script>
  window.addEventListener('DOMContentLoaded', () => {
    initializeGAppsSync();
    loadParticipantsDataWithSync();
  });
</script>
```

### 2. Initialization Flow

```javascript
// 1. Load gapps-sync
initializeGAppsSync()
  ├─ Deteksi environment (GAS vs Vercel vs Local)
  ├─ Setup API_BASE_URL jika Vercel
  └─ Ready untuk call backend

// 2. Load data
loadParticipantsDataWithSync()
  ├─ Call backend via wrapper
  ├─ Update UI dengan data
  └─ Show toast notification

// 3. Start camera
startQrScanner()
  ├─ Request izin kamera
  ├─ Initialize html5-qrcode
  └─ Handle errors dengan grace
```

### 3. Key UI Functions

Fungsi-fungsi penting yang perlu ada di `Index.html`:

```javascript
// Data loading
loadParticipantsData()           // Refresh dari backend
renderParticipantsTable(list)    // Render tabel peserta
renderLogsTable(logs)            // Render log riwayat
renderLiveFeed(logs)             // Update live feed

// Scanner
startQrScanner()                 // Mulai scanner
stopQrScanner()                  // Stop scanner
onScanSuccess(decodedText)       // Handle scan result

// Status update
fetchParticipantForAction(id)    // Get participant details
execUpdateStatus(statusType)     // Update status
showScanActionCard(participant)  // Show action UI

// Admin
handleAdminLogin(password)       // Login verification
triggerDriveQRGenerate()        // Generate QR codes
processExcelImport(data)         // Import dari Excel

// Utilities
showToast(message, type)         // Notification
filterParticipants()             // Search/filter
openQrModal(id, name, nim, url) // Show QR modal
```

---

## ☁️ Vercel Backend Integration

### 1. Setup Steps

```bash
# 1. Clone backend ke folder lokal
cd vercel-backend

# 2. Install dependencies
npm install

# 3. Setup .env
cp .env.example .env
# Edit .env dengan credentials Anda

# 4. Test lokal
npm run dev
# Server di http://localhost:3000

# 5. Deploy ke Vercel
vercel
# Follow prompts
```

### 2. Environment Configuration

Di Vercel dashboard, set environment variables:

```
SPREADSHEET_ID = 11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk
DRIVE_FOLDER_ID = 1T2KFEN5avSOW25-cUHub-ZF2U2unSpU2
ADMIN_PASSWORD = adminArRaniry2026
CORS_ORIGIN = * (atau domain specific)
NODE_ENV = production
```

### 3. Connect Frontend to Vercel API

Di `Index.html`, tambahkan:

```html
<script>
  // Set API URL untuk Vercel backend
  window.API_BASE_URL = 'https://your-vercel-domain.vercel.app/api';
</script>
<script src="gapps-sync.js"></script>
```

### 4. API Response Format

Semua endpoint return format yang konsisten:

```json
{
  "success": true/false,
  "data": { /* response data */ },
  "message": "Description message",
  "timestamp": "2026-09-24T08:15:00.000Z"
}
```

---

## 🔄 Communication Flow

### Scenario 1: Scan QR & Update Status (GAS Mode)

```
1. User scan QR code
   └─> camera-handler.js: onScanSuccess()

2. Get participant details
   └─> gapps-sync.js: callFindParticipantById()
       └─> (GAS: google.script.run.findParticipantById())
           └─> Code.gs: findParticipantById()
               └─> Query Google Sheets

3. Show action card
   └─> UI: showScanActionCard()

4. User klik "HADIR"
   └─> gapps-sync.js: callUpdateParticipantStatus()
       └─> (GAS: google.script.run.updateParticipantStatus())
           └─> Code.gs: updateParticipantStatus()
               ├─> Update DataPeserta sheet
               ├─> Add row to LogAbsensi sheet
               └─> Return success response

5. Update UI
   └─> Reload data & show success toast
```

### Scenario 2: Same Flow (Vercel Mode)

```
1-3. Same sebagai GAS mode

4. User klik "HADIR"
   └─> gapps-sync.js: callUpdateParticipantStatus()
       └─> (Vercel: fetch POST /api/participants/:id/status)
           └─> Vercel Backend: index.js route handler
               └─> API menggunakan Google Sheets API library
                   ├─> Authenticate dengan service account
                   ├─> Update sheets
                   └─> Return response

5. Update UI
   └─> Same sebagai GAS
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "google.script.run is not defined"

**Penyebab**: 
- Bukan running di Google Apps Script
- Script loading terlalu awal

**Solusi**:
```javascript
// Di gapps-sync.js: check sudah benar
if (typeof google !== 'undefined' && google.script && google.script.run) {
  IS_GOOGLE_APPS_SCRIPT = true;
} else {
  IS_GOOGLE_APPS_SCRIPT = false;
  API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api';
}
```

### Issue 2: "CORS error in Vercel mode"

**Penyebab**:
- Frontend domain tidak di-whitelist di Vercel

**Solusi**:
```javascript
// Di Vercel backend index.js
app.use(cors({
  origin: ['https://yourdomain.com', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Atau update env variable
CORS_ORIGIN=https://yourdomain.com
```

### Issue 3: "Data tidak disimpan ke Sheets"

**Penyebab**:
- Permission error
- Spreadsheet ID salah
- Sheet structure tidak benar

**Solusi**:
1. Verify Spreadsheet ID:
   ```
   https://docs.google.com/spreadsheets/d/[ID]/...
   Ambil [ID] dan pastikan cocok di Code.gs
   ```

2. Verify akses:
   - Buka Sheet URL
   - Pastikan bisa edit
   - Share dengan service account jika Vercel

3. Check sheet structure:
   ```
   DataPeserta: ID | Nama | NIM | Email | Kategori | Status | Waktu | QR
   LogAbsensi:  No | Waktu | ID | Nama | NIM | Status | Kategori
   ```

### Issue 4: "Camera permission denied"

**Penyebab**:
- Browser belum diberi izin
- Device tidak punya kamera

**Solusi**:
- gapps-sync.js sudah handle ini dengan `showCameraPermissionGuide()`
- User follow instruksi di modal popup

### Issue 5: "Batch import tidak bekerja"

**Penyebab**:
- Format Excel salah
- Missing required fields

**Solusi**:
```javascript
// Excel harus punya column:
// id, nama, nim, email, kategori

// Contoh format yang benar:
{
  id: "UIN-001",
  nama: "John Doe",
  nim: "2001030001",
  email: "john@email.com",
  kategori: "Mahasiswa"
}
```

---

## ✅ Verification Checklist

### GAS Mode Checklist
- [ ] Semua file upload di Apps Script editor
- [ ] appsscript.json di-enable di Project Settings
- [ ] Deployed sebagai Web App
- [ ] URL deployment bisa diakses
- [ ] Kamera permission work
- [ ] Scan QR dan update status work
- [ ] Data tersimpan di Google Sheets
- [ ] Log riwayat terupdate

### Vercel Mode Checklist
- [ ] Backend deploy ke Vercel
- [ ] All env variables set di Vercel dashboard
- [ ] API health check: `/api/health` return 200
- [ ] API endpoints tested via Postman
- [ ] Frontend updated dengan API_BASE_URL
- [ ] CORS configured correctly
- [ ] All flows tested: get data, update status, import batch
- [ ] Error handling work properly

---

## 📚 Quick Reference

### Frontend -> Backend Call Pattern

```javascript
// Pattern untuk compatibility GAS & Vercel
async function callMyFunction(param1, param2) {
  try {
    if (IS_GOOGLE_APPS_SCRIPT) {
      // Google Apps Script
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .myFunctionInCodeGs(param1, param2);
      });
    } else {
      // Vercel API
      const response = await fetch(`${API_BASE_URL}/myendpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ param1, param2 })
      });
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Response Handling Pattern

```javascript
// Success response dari backend
{
  success: true,
  data: { /* data object */ },
  message: "Success message",
  timestamp: "..."
}

// Error response
{
  success: false,
  message: "Error description",
  timestamp: "..."
}

// Frontend handling
try {
  const response = await callBackendFunction();
  if (response.success) {
    // Process data
    showToast(response.message, 'success');
  } else {
    showToast(response.message, 'error');
  }
} catch (error) {
  showToast(`Error: ${error.message}`, 'error');
}
```

---

## 📞 Support

Untuk issue lebih detailed:

1. **Check Logs**:
   - Browser: F12 → Console tab
   - Google Apps Script: Execution logs
   - Vercel: Logs tab di dashboard

2. **Enable Debug Mode**:
   ```javascript
   // Di browser console
   localStorage.debug = 'true';
   location.reload();
   ```

3. **Test Manually**:
   - Gunakan Postman untuk test API
   - Coba input manual jika scanner fail
   - Test di browser berbeda

---

**Last Updated**: September 24, 2026  
**Version**: 1.0.0
