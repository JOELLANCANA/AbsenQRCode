/**
 * GOOGLE APPS SCRIPT SYNC - Sistem Absensi QR Code
 * Menangani komunikasi dua arah dengan Code.gs dan error handling
 */

// Flag untuk mendeteksi environment (Apps Script vs Vercel/Local)
let IS_GOOGLE_APPS_SCRIPT = false;
let API_BASE_URL = '';

// Inisialisasi environment
function initializeEnvironment() {
  // Deteksi jika running di Google Apps Script
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    IS_GOOGLE_APPS_SCRIPT = true;
    console.log('✓ Environment: Google Apps Script');
  } else {
    // Fallback ke Vercel atau local dev
    IS_GOOGLE_APPS_SCRIPT = false;
    // Set API URL dari environment atau default
    API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api';
    console.log('ℹ Environment: Vercel/Local Dev - API URL:', API_BASE_URL);
  }
}

/**
 * WRAPPER FUNCTION - Abstraksi layer untuk memanggil backend
 * Kompatibel dengan Google Apps Script dan Vercel
 */

/**
 * Get Data Peserta & Log - Kompatibel dengan GAS dan Vercel
 */
async function callGetParticipantsData() {
  try {
    if (IS_GOOGLE_APPS_SCRIPT) {
      // Google Apps Script
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler((error) => {
            console.error('GAS Error:', error);
            reject(error);
          })
          .getParticipantsData();
      });
    } else {
      // Vercel API
      const response = await fetch(`${API_BASE_URL}/participants`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error calling getParticipantsData:', error);
    throw error;
  }
}

/**
 * Find Participant by ID
 */
async function callFindParticipantById(participantId) {
  try {
    if (IS_GOOGLE_APPS_SCRIPT) {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .findParticipantById(participantId);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/participants/${encodeURIComponent(participantId)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error finding participant:', error);
    throw error;
  }
}

/**
 * Update Participant Status
 */
async function callUpdateParticipantStatus(participantId, statusType) {
  try {
    if (IS_GOOGLE_APPS_SCRIPT) {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .updateParticipantStatus(participantId, statusType);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/participants/${encodeURIComponent(participantId)}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusType })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
}

/**
 * Import Participants Batch
 */
async function callImportParticipantsBatch(participantsArray) {
  try {
    if (IS_GOOGLE_APPS_SCRIPT) {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .importParticipantsBatch(participantsArray);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/participants/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants: participantsArray })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error importing batch:', error);
    throw error;
  }
}

/**
 * Verify Admin Login
 */
async function callVerifyAdminLogin(password) {
  try {
    if (IS_GOOGLE_APPS_SCRIPT) {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .verifyAdminLogin(password);
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error verifying admin login:', error);
    throw error;
  }
}

/**
 * Generate QR Codes to Drive
 */
async function callGenerateQRCodesToDrive() {
  try {
    if (IS_GOOGLE_APPS_SCRIPT) {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .generateQRCodesToDrive();
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/qrcodes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error generating QR codes:', error);
    throw error;
  }
}

/**
 * Setup Sheet (jika belum ada)
 */
async function callSetupSheet() {
  try {
    if (IS_GOOGLE_APPS_SCRIPT) {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .setupSheet();
      });
    } else {
      const response = await fetch(`${API_BASE_URL}/admin/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error setting up sheet:', error);
    throw error;
  }
}

/**
 * HELPER FUNCTIONS untuk UI
 */

/**
 * Load data peserta dengan error handling
 */
async function loadParticipantsDataWithSync() {
  try {
    showToast('Memuat data dari Google Sheet...', 'info');
    const response = await callGetParticipantsData();

    if (response.success) {
      participantsList = response.participants || [];
      logsList = response.logs || [];

      renderParticipantsTable(participantsList);
      renderAdminParticipantsTable(participantsList);
      renderLogsTable(logsList);
      renderLiveFeed(logsList);
      renderReportTable(participantsList, logsList);
      updateStats(participantsList, logsList);

      showToast(`✓ Data berhasil dimuat: ${participantsList.length} peserta`, 'success');
    } else {
      throw new Error(response.error || response.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Error loading participants:', error);
    showToast(`❌ Gagal memuat data: ${error.message}`, 'error');

    // Fallback: gunakan mock data
    if (typeof MOCK_DATA !== 'undefined') {
      console.log('Menggunakan mock data sebagai fallback');
      participantsList = MOCK_DATA;
      logsList = MOCK_LOGS;
      renderParticipantsTable(participantsList);
      renderAdminParticipantsTable(participantsList);
      renderLogsTable(logsList);
      updateStats(participantsList, logsList);
    }
  }
}

/**
 * Fetch participant for action dengan sync
 */
async function fetchParticipantForActionWithSync(participantId) {
  try {
    showToast(`Memeriksa ID: ${participantId}`, 'info');

    const response = await callFindParticipantById(participantId);

    if (response.success) {
      showScanActionCard(response.participant);
    } else {
      showToast(response.message || 'Peserta tidak ditemukan', 'error');
    }
  } catch (error) {
    console.error('Error fetching participant:', error);
    showToast(`❌ Error: ${error.message}`, 'error');
  }
}

/**
 * Execute update status dengan sync
 */
async function execUpdateStatusWithSync(statusType) {
  if (!currentScannedParticipant) return;

  const pId = currentScannedParticipant.id;

  try {
    showToast(`Menyimpan status [${statusType}]...`, 'info');

    const response = await callUpdateParticipantStatus(pId, statusType);

    if (response.success) {
      showToast(response.message, 'success');
      resetScanCard();
      await loadParticipantsDataWithSync();
    } else {
      showToast(response.message || 'Gagal memperbarui status', 'error');
    }
  } catch (error) {
    console.error('Error updating status:', error);
    showToast(`❌ Error: ${error.message}`, 'error');
  }
}

/**
 * Handle admin login dengan sync
 */
async function handleAdminLoginWithSync(password) {
  try {
    showToast('Verifikasi password...', 'info');

    const response = await callVerifyAdminLogin(password);

    if (response.success) {
      localStorage.setItem('adminToken', response.token);
      showToast('✓ Login berhasil!', 'success');
      document.getElementById('admin-login-box').classList.add('hidden');
      document.getElementById('admin-dashboard').classList.remove('hidden');
    } else {
      showToast(response.message || 'Password salah', 'error');
    }
  } catch (error) {
    console.error('Error verifying admin login:', error);
    showToast(`❌ Error: ${error.message}`, 'error');
  }
}

/**
 * Trigger QR generation dengan sync
 */
async function triggerDriveQRGenerateWithSync() {
  try {
    showToast('Generating QR Codes... (Ini mungkin butuh beberapa menit)', 'info');

    const response = await callGenerateQRCodesToDrive();

    if (response.success) {
      showToast(`✓ ${response.message}`, 'success');
      if (response.folderUrl) {
        window.open(response.folderUrl, '_blank');
      }
      await loadParticipantsDataWithSync();
    } else {
      showToast(response.message || 'Gagal generate QR codes', 'error');
    }
  } catch (error) {
    console.error('Error generating QR codes:', error);
    showToast(`❌ Error: ${error.message}`, 'error');
  }
}

/**
 * Process Excel import dengan sync
 */
async function processExcelImportWithSync(excelData) {
  try {
    showToast('Mengimpor data Excel...', 'info');

    const response = await callImportParticipantsBatch(excelData);

    if (response.success) {
      showToast(response.message, 'success');
      closeExcelUploadModal();
      await loadParticipantsDataWithSync();
    } else {
      showToast(response.message || 'Gagal mengimpor data', 'error');
    }
  } catch (error) {
    console.error('Error importing Excel:', error);
    showToast(`❌ Error: ${error.message}`, 'error');
  }
}

/**
 * Initialize semua sync functions - panggil di DOMContentLoaded
 */
function initializeGAppsSync() {
  initializeEnvironment();

  console.log('Google Apps Script Sync initialized');
  console.log('IS_GOOGLE_APPS_SCRIPT:', IS_GOOGLE_APPS_SCRIPT);
  console.log('API_BASE_URL:', API_BASE_URL);

  // Setup sheet jika diperlukan (hanya untuk GAS)
  if (IS_GOOGLE_APPS_SCRIPT) {
    callSetupSheet()
      .then(result => console.log('Sheet setup result:', result))
      .catch(err => console.warn('Sheet setup warning:', err));
  }
}
