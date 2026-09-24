// ==============================================================================
// SISTEM ABSENSI QR CODE - UIN AR-RANIRY BANDA ACEH
// Backend: Google Apps Script (Code.gs)
// Dokumentasi: Kompatibel dengan Google Apps Script & Vercel
// ==============================================================================

// ID Google Spreadsheet dan Drive
const SPREADSHEET_ID = '11q7bt212H_-l-CcklK-yygeigMQH8l-CBGihT1BGKHk'; 
const DRIVE_FOLDER_ID = '1T2KFEN5avSOW25-cUHub-ZF2U2unSpU2'; // Google Drive Folder ID
const SHEET_PESERTA = 'DataPeserta';
const SHEET_LOG = 'LogAbsensi';
const DRIVE_FOLDER_NAME = 'QR_Codes_Absensi_UIN_ArRaniry';

// CORS Headers untuk frontend
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

/**
 * Mengembalikan instance spreadsheet aktif.
 */
function getActiveSS() {
  let ss = null;
  
  // 1. Coba Spreadsheet container-bound
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    // Fallback jika standalone
  }

  // 2. Fallback: Buka via Spreadsheet ID
  if (!ss && SPREADSHEET_ID) {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      throw new Error("Gagal membuka Spreadsheet ID: " + SPREADSHEET_ID + ". Pastikan ID benar dan akun memiliki izin akses.");
    }
  }

  if (!ss) {
    throw new Error("Spreadsheet tidak ditemukan! Pastikan skrip terhubung ke Google Sheet atau SPREADSHEET_ID di Code.gs sudah diisi.");
  }
  return ss;
}

/**
 * Mengembalikan halaman HTML utama untuk Web App.
 */
function doGet(e) {
  try {
    const template = HtmlService.createTemplateFromFile('Index');
    return template.evaluate()
      .setTitle('Sistem Absensi QR Code - UIN Ar-Raniry')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (e) {
    return HtmlService.createHtmlOutput('ERROR: ' + e.message);
  }
}

/**
 * Handle OPTIONS request untuk CORS (jika diperlukan)
 */
function doOptions(e) {
  return HtmlService.createHtmlOutput('')
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Inisialisasi Sheet DataPeserta & LogAbsensi jika belum ada.
 */
function setupSheet() {
  try {
    const ss = getActiveSS();
    
    // 1. Setup Sheet DataPeserta
    let sheetPeserta = ss.getSheetByName(SHEET_PESERTA);
    if (!sheetPeserta) {
      sheetPeserta = ss.insertSheet(SHEET_PESERTA);
    }
    
    if (sheetPeserta.getLastRow() === 0) {
      sheetPeserta.appendRow([
        'ID Peserta', 
        'Nama Lengkap', 
        'NIM / NIP / Instansi', 
        'Email', 
        'Kategori', 
        'Status Terakhir', 
        'Waktu Terakhir', 
        'URL QR Code'
      ]);
      
      sheetPeserta.getRange(1, 1, 1, 8)
        .setBackground('#006837')
        .setFontColor('#FFFFFF')
        .setFontWeight('bold');
        
      const sampleData = [
        ['UIN-001', 'Dr. Ahmad Farhan, M.Ag', '198203152008011002', 'ahmad.farhan@ar-raniry.ac.id', 'Dosen', 'Belum Hadir', '-', ''],
        ['UIN-002', 'Siti Rahmah, S.T.', '2001030045', 'siti.rahmah@student.ar-raniry.ac.id', 'Mahasiswa', 'Belum Hadir', '-', ''],
        ['UIN-003', 'Rahmat Hidayat', '2001030089', 'rahmat.hidayat@student.ar-raniry.ac.id', 'Mahasiswa', 'Belum Hadir', '-', '']
      ];
      sheetPeserta.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
    }

    // 2. Setup Sheet LogAbsensi
    let sheetLog = ss.getSheetByName(SHEET_LOG);
    if (!sheetLog) {
      sheetLog = ss.insertSheet(SHEET_LOG);
    }

    if (sheetLog.getLastRow() === 0) {
      sheetLog.appendRow([
        'No Log',
        'Waktu Log',
        'ID Peserta',
        'Nama Peserta',
        'NIM / NIP',
        'Aksi Status',
        'Kategori Peserta'
      ]);

      sheetLog.getRange(1, 1, 1, 7)
        .setBackground('#FDB913')
        .setFontColor('#1E293B')
        .setFontWeight('bold');
    }

    return { success: true, message: 'Sheet siap digunakan!' };
  } catch (error) {
    return { success: false, message: 'Setup Error: ' + error.message };
  }
}

/**
 * Mengambil seluruh data peserta & riwayat log dari Google Sheet.
 */
function getParticipantsData() {
  try {
    const ss = getActiveSS();
    let sheetPeserta = ss.getSheetByName(SHEET_PESERTA);
    let sheetLog = ss.getSheetByName(SHEET_LOG);
    
    if (!sheetPeserta || !sheetLog) {
      setupSheet();
      sheetPeserta = ss.getSheetByName(SHEET_PESERTA);
      sheetLog = ss.getSheetByName(SHEET_LOG);
    }
    
    // Data Peserta
    const data = sheetPeserta.getDataRange().getValues();
    const participants = [];
    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row[0]) continue;
        
        const p = {
          id: String(row[0]).trim(),
          nama: String(row[1] || ''),
          nim: String(row[2] || ''),
          email: String(row[3] || ''),
          kategori: String(row[4] || 'Peserta'),
          status: String(row[5] || 'Belum Hadir'),
          waktuAbsen: row[6] instanceof Date ? formatDate(row[6]) : String(row[6] || '-'),
          qrUrl: String(row[7] || '')
        };
        
        if (!p.qrUrl) {
          p.qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(p.id)}&size=300&margin=1`;
        }
        participants.push(p);
      }
    }

    // Data Log
    const logData = sheetLog.getDataRange().getValues();
    const logs = [];
    if (logData.length > 1) {
      for (let j = logData.length - 1; j >= 1; j--) {
        const lRow = logData[j];
        if (!lRow[0] && !lRow[1]) continue;
        logs.push({
          no: lRow[0],
          waktu: lRow[1] instanceof Date ? formatDate(lRow[1]) : String(lRow[1] || '-'),
          id: String(lRow[2] || ''),
          nama: String(lRow[3] || ''),
          nim: String(lRow[4] || ''),
          status: String(lRow[5] || '-'),
          kategori: String(lRow[6] || 'Peserta')
        });
      }
    }
    
    return { success: true, participants: participants, logs: logs };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Mencari data peserta berdasarkan ID.
 */
function findParticipantById(participantId) {
  try {
    const cleanId = String(participantId || '').trim();
    if (!cleanId) return { success: false, message: 'ID Peserta tidak boleh kosong' };

    const ss = getActiveSS();
    const sheet = ss.getSheetByName(SHEET_PESERTA);
    if (!sheet) return { success: false, message: 'Sheet DataPeserta tidak ditemukan' };

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toLowerCase() === cleanId.toLowerCase()) {
        return {
          success: true,
          participant: {
            id: String(data[i][0]),
            nama: String(data[i][1] || ''),
            nim: String(data[i][2] || ''),
            email: String(data[i][3] || ''),
            kategori: String(data[i][4] || 'Peserta'),
            status: String(data[i][5] || 'Belum Hadir'),
            waktuAbsen: data[i][6] instanceof Date ? formatDate(data[i][6]) : String(data[i][6] || '-')
          }
        };
      }
    }
    return { success: false, message: `Data Peserta dengan ID "${participantId}" tidak ditemukan!` };
  } catch (err) {
    return { success: false, message: 'Terjadi kesalahan: ' + err.message };
  }
}

/**
 * Menyimpan opsi status (HADIR, KELUAR, MASUK KEMBALI) dan mencatat ke Log.
 */
function updateParticipantStatus(participantId, statusType) {
  try {
    const cleanId = String(participantId || '').trim();
    const validStatuses = ['HADIR', 'KELUAR', 'MASUK KEMBALI'];
    
    if (!validStatuses.includes(statusType)) {
      return { success: false, message: 'Opsi status tidak valid!' };
    }

    const ss = getActiveSS();
    let sheetPeserta = ss.getSheetByName(SHEET_PESERTA);
    let sheetLog = ss.getSheetByName(SHEET_LOG);

    if (!sheetPeserta || !sheetLog) {
      setupSheet();
      sheetPeserta = ss.getSheetByName(SHEET_PESERTA);
      sheetLog = ss.getSheetByName(SHEET_LOG);
    }

    const data = sheetPeserta.getDataRange().getValues();
    let foundRow = -1;
    let pData = null;

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toLowerCase() === cleanId.toLowerCase()) {
        foundRow = i + 1;
        pData = {
          id: String(data[i][0]),
          nama: String(data[i][1] || ''),
          nim: String(data[i][2] || ''),
          email: String(data[i][3] || ''),
          kategori: String(data[i][4] || 'Peserta')
        };
        break;
      }
    }

    if (foundRow === -1) {
      return { success: false, message: 'Data peserta tidak ditemukan di database.' };
    }

    const nowFormatted = formatDate(new Date());

    // 1. Update status terakhir di Sheet DataPeserta
    sheetPeserta.getRange(foundRow, 6).setValue(statusType); // Col F
    sheetPeserta.getRange(foundRow, 7).setValue(nowFormatted); // Col G

    // 2. Catat Log Riwayat Kehadiran di Sheet LogAbsensi
    const logLastRow = Math.max(1, sheetLog.getLastRow());
    const newLogNo = logLastRow;

    sheetLog.appendRow([
      newLogNo,
      nowFormatted,
      pData.id,
      pData.nama,
      pData.nim,
      statusType,
      pData.kategori
    ]);

    pData.status = statusType;
    pData.waktuAbsen = nowFormatted;

    return {
      success: true,
      message: `Status [${statusType}] berhasil disimpan untuk ${pData.nama}`,
      participant: pData
    };
  } catch (err) {
    return { success: false, message: 'Gagal memperbarui status: ' + err.message };
  }
}

/**
 * Mengimpor / memperbarui data peserta secara massal dari Excel.
 */
function importParticipantsBatch(participantsArray) {
  try {
    if (!Array.isArray(participantsArray) || participantsArray.length === 0) {
      return { success: false, message: 'Data masukan kosong' };
    }

    const ss = getActiveSS();
    let sheet = ss.getSheetByName(SHEET_PESERTA);
    if (!sheet) {
      setupSheet();
      sheet = ss.getSheetByName(SHEET_PESERTA);
    }

    const existingData = sheet.getDataRange().getValues();
    const existingIdsMap = new Map();

    for (let i = 1; i < existingData.length; i++) {
      const rowId = String(existingData[i][0]).trim().toLowerCase();
      if (rowId) existingIdsMap.set(rowId, i + 1);
    }

    let addedCount = 0;
    let updatedCount = 0;

    participantsArray.forEach(p => {
      const cleanId = String(p.id || '').trim();
      const cleanNama = String(p.nama || '').trim();
      if (!cleanId || !cleanNama) return;

      const lowerId = cleanId.toLowerCase();
      const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(cleanId)}&size=300&margin=1`;
      
      if (existingIdsMap.has(lowerId)) {
        const rowIndex = existingIdsMap.get(lowerId);
        sheet.getRange(rowIndex, 2).setValue(cleanNama);
        sheet.getRange(rowIndex, 3).setValue(String(p.nim || ''));
        sheet.getRange(rowIndex, 4).setValue(String(p.email || ''));
        sheet.getRange(rowIndex, 5).setValue(String(p.kategori || 'Peserta'));
        updatedCount++;
      } else {
        sheet.appendRow([
          cleanId,
          cleanNama,
          String(p.nim || ''),
          String(p.email || ''),
          String(p.kategori || 'Peserta'),
          'Belum Hadir',
          '-',
          qrUrl
        ]);
        addedCount++;
      }
    });

    return {
      success: true,
      message: `Berhasil mengimpor: ${addedCount} data baru ditambahkan, ${updatedCount} diperbarui.`
    };
  } catch (err) {
    return { success: false, message: 'Gagal impor data: ' + err.message };
  }
}

/**
 * Autentikasi Login Admin.
 */
function verifyAdminLogin(password) {
  const DEFAULT_PASS = 'adminArRaniry2026';
  const scriptProperties = PropertiesService.getScriptProperties();
  const storedPass = scriptProperties.getProperty('ADMIN_PASSWORD') || DEFAULT_PASS;
  
  if (password === storedPass) {
    return { success: true, token: 'AUTH_' + Math.random().toString(36).substring(2) };
  } else {
    return { success: false, message: 'Password Admin Salah!' };
  }
}

/**
 * Generate dan simpan QR Code seluruh peserta ke Google Drive.
 */
function generateQRCodesToDrive() {
  try {
    const ss = getActiveSS();
    const sheet = ss.getSheetByName(SHEET_PESERTA);
    if (!sheet) return { success: false, message: 'Sheet tidak ditemukan' };
    
    let folder;
    
    // 1. Coba gunakan DRIVE_FOLDER_ID jika tersedia
    if (DRIVE_FOLDER_ID) {
      try {
        folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      } catch (e) {
        // Jika ID tidak valid, cari berdasarkan nama
        const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
        folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(DRIVE_FOLDER_NAME);
      }
    } else {
      // 2. Fallback: Cari berdasarkan nama folder
      const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
      }
    }
    
    // Set sharing untuk folder
    try {
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {
      // Jika gagal set sharing, lanjutkan tanpa error
    }
    
    const data = sheet.getDataRange().getValues();
    let generatedCount = 0;
    const errors = [];
    
    for (let i = 1; i < data.length; i++) {
      try {
        const id = String(data[i][0]).trim();
        const nama = String(data[i][1]).trim();
        let existingUrl = String(data[i][7] || '');
        
        if (id && !existingUrl) {
          const qrApiUrl = `https://quickchart.io/qr?text=${encodeURIComponent(id)}&size=500&margin=2`;
          const response = UrlFetchApp.fetch(qrApiUrl, { muteHttpExceptions: true });
          
          if (response.getResponseCode() === 200) {
            const blob = response.getBlob().setName(`QR_${id}_${nama.replace(/[^a-zA-Z0-9]/g, '_')}.png`);
            const file = folder.createFile(blob);
            file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            sheet.getRange(i + 1, 8).setValue(file.getUrl());
            generatedCount++;
          } else {
            errors.push(`Gagal generate QR untuk ${id}: API error`);
          }
        }
      } catch (e) {
        errors.push(`Error baris ${i + 1}: ${e.message}`);
      }
    }
    
    let message = `Berhasil generate ${generatedCount} QR Code ke Google Drive folder '${DRIVE_FOLDER_NAME}'.`;
    if (errors.length > 0) {
      message += ` Errors: ${errors.join('; ')}`;
    }
    
    return { 
      success: true, 
      message: message,
      generatedCount: generatedCount,
      folderUrl: folder.getUrl()
    };
  } catch (err) {
    return { success: false, message: 'Gagal generate QR Code: ' + err.message };
  }
}

/**
 * Helper Format Tanggal Indonesia yang aman.
 */
function formatDate(date) {
  if (!date || date === '-') return '-';
  if (!(date instanceof Date)) {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return String(date);
    date = parsed;
  }
  const d = ('0' + date.getDate()).slice(-2);
  const m = ('0' + (date.getMonth() + 1)).slice(-2);
  const y = date.getFullYear();
  const h = ('0' + date.getHours()).slice(-2);
  const min = ('0' + date.getMinutes()).slice(-2);
  const s = ('0' + date.getSeconds()).slice(-2);
  return `${d}/${m}/${y} ${h}:${min}:${s} WIB`;
}
