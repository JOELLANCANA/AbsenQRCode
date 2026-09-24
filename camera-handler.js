/**
 * CAMERA HANDLER - Sistem Absensi QR Code
 * Menangani izin kamera, scanner QR, dan error handling
 */

let html5QrCode = null;
let selectedFacingMode = "environment";
let isScanning = false;
let cameraPermissionGranted = false;

/**
 * Inisialisasi scanner QR dengan error handling sempurna
 */
async function initializeQrScanner() {
  try {
    // 1. Cek support browser untuk getUserMedia
    const hasGetUserMedia = !!(
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    );

    if (!hasGetUserMedia) {
      console.warn('Browser tidak mendukung kamera');
      showToast('❌ Browser Anda tidak mendukung akses kamera. Gunakan browser modern (Chrome, Firefox, Safari, Edge)', 'error');
      disableScanner();
      return false;
    }

    // 2. Request izin kamera dengan error handling
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: selectedFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      // Stop stream setelah sukses (hanya untuk cek izin)
      stream.getTracks().forEach(track => track.stop());
      cameraPermissionGranted = true;
      console.log('✓ Izin kamera berhasil diberikan');

    } catch (permissionError) {
      cameraPermissionGranted = false;
      
      if (permissionError.name === 'NotAllowedError' || permissionError.name === 'PermissionDeniedError') {
        console.error('❌ Pengguna menolak izin kamera:', permissionError);
        showToast('⚠️ Izin Kamera Ditolak!\n\n📱 Cara memberikan izin:\n1. Buka pengaturan browser\n2. Cari "Izin" atau "Permissions"\n3. Izinkan akses kamera untuk aplikasi ini\n4. Muat ulang halaman', 'error');
        showCameraPermissionGuide();
        disableScanner();
        return false;
        
      } else if (permissionError.name === 'NotFoundError' || permissionError.name === 'DevicesNotFoundError') {
        console.error('❌ Kamera tidak ditemukan:', permissionError);
        showToast('❌ Kamera tidak ditemukan pada perangkat Anda. Periksa koneksi hardware kamera.', 'error');
        disableScanner();
        return false;
        
      } else if (permissionError.name === 'NotReadableError') {
        console.error('❌ Kamera sedang digunakan aplikasi lain:', permissionError);
        showToast('❌ Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi tersebut dan coba lagi.', 'error');
        disableScanner();
        return false;
        
      } else if (permissionError.name === 'OverconstrainedError') {
        console.warn('⚠️ Spesifikasi kamera tidak terpenuhi, mencoba dengan setting default...');
        // Retry tanpa constraint ketat
        try {
          const retryStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: selectedFacingMode },
            audio: false
          });
          retryStream.getTracks().forEach(track => track.stop());
          cameraPermissionGranted = true;
        } catch (retryError) {
          console.error('❌ Gagal dengan setting default:', retryError);
          showToast('❌ Tidak dapat mengakses kamera dengan spesifikasi yang sesuai.', 'error');
          disableScanner();
          return false;
        }
      } else {
        console.error('❌ Error kamera tidak diketahui:', permissionError);
        showToast(`❌ Error Kamera: ${permissionError.message || 'Unknown error'}`, 'error');
        disableScanner();
        return false;
      }
    }

    // 3. Initialize html5-qrcode scanner jika izin diberikan
    if (cameraPermissionGranted) {
      try {
        html5QrCode = new Html5Qrcode("reader", {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.CODE_93,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13
          ],
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          },
          verbose: false
        });

        // Set camera constraints
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.77778,
          disableFlip: false
        };

        await html5QrCode.start(
          { facingMode: selectedFacingMode },
          config,
          onScanSuccess,
          onScanError
        );

        isScanning = true;
        showToast('✓ Scanner QR Code siap!', 'success');
        return true;

      } catch (initError) {
        console.error('❌ Gagal inisialisasi scanner:', initError);
        showToast(`❌ Gagal inisialisasi scanner: ${initError.message}`, 'error');
        return false;
      }
    }

    return false;

  } catch (error) {
    console.error('❌ Error tidak terduga di initializeQrScanner:', error);
    showToast(`❌ Error: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Start scanner dengan retry logic
 */
async function startQrScanner() {
  if (isScanning) {
    console.log('Scanner sudah berjalan');
    return;
  }

  const success = await initializeQrScanner();
  
  if (!success) {
    // Tampilkan UI fallback untuk input manual
    showManualInputOption();
  }
}

/**
 * Stop scanner
 */
async function stopQrScanner() {
  if (html5QrCode && isScanning) {
    try {
      await html5QrCode.stop();
      isScanning = false;
      console.log('✓ Scanner dihentikan');
    } catch (err) {
      console.error('Error menghentikan scanner:', err);
    }
  }
}

/**
 * Switch kamera (depan/belakang)
 */
async function onCameraSelectChange(facingMode) {
  selectedFacingMode = facingMode;
  console.log(`Mengubah kamera ke: ${facingMode}`);
  
  await stopQrScanner();
  
  // Delay sebelum restart untuk memastikan cleanup
  setTimeout(() => {
    startQrScanner();
  }, 500);
}

/**
 * Callback ketika QR berhasil di-scan
 */
function onScanSuccess(decodedText) {
  console.log('✓ QR Code detected:', decodedText);
  playTerimaKasihSound();
  fetchParticipantForAction(decodedText);
}

/**
 * Callback ketika scan error
 */
function onScanError(error) {
  // Suppress error messages jika scanner masih berjalan
  if (isScanning && html5QrCode) {
    // Normal scanning process, tidak perlu log error
  }
}

/**
 * Tampilkan UI guide untuk memberikan izin kamera
 */
function showCameraPermissionGuide() {
  const guideDiv = document.createElement('div');
  guideDiv.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  guideDiv.innerHTML = `
    <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
      <div class="text-center mb-6">
        <div class="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 text-3xl">
          <i class="fa-solid fa-lock"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-800">Izin Kamera Diperlukan</h3>
        <p class="text-sm text-slate-600 mt-2">Untuk menggunakan scanner QR Code, aplikasi memerlukan akses ke kamera perangkat Anda.</p>
      </div>

      <div class="space-y-3 mb-6 text-sm">
        <details class="border border-slate-200 rounded-lg p-3 cursor-pointer">
          <summary class="font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-chrome text-yellow-500"></i> Chrome / Edge
          </summary>
          <ol class="mt-2 text-slate-600 list-decimal list-inside space-y-1">
            <li>Klik ikon gembok di bar URL</li>
            <li>Pilih "Izin" atau "Permissions"</li>
            <li>Untuk Kamera, pilih "Izinkan"</li>
            <li>Muat ulang halaman ini (Ctrl+R)</li>
          </ol>
        </details>

        <details class="border border-slate-200 rounded-lg p-3 cursor-pointer">
          <summary class="font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-firefox text-orange-500"></i> Firefox
          </summary>
          <ol class="mt-2 text-slate-600 list-decimal list-inside space-y-1">
            <li>Klik menu hamburger (≡)</li>
            <li>Pilih Settings → Privacy & Security</li>
            <li>Cari "Permissions → Camera"</li>
            <li>Tambahkan domain ini dan izinkan akses</li>
          </ol>
        </details>

        <details class="border border-slate-200 rounded-lg p-3 cursor-pointer">
          <summary class="font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-mobile text-blue-500"></i> Mobile (Android/iOS)
          </summary>
          <ol class="mt-2 text-slate-600 list-decimal list-inside space-y-1">
            <li>Buka Pengaturan perangkat</li>
            <li>Cari "Izin" atau "Permissions"</li>
            <li>Pilih Kamera</li>
            <li>Cari nama aplikasi/browser Anda</li>
            <li>Ubah ke "Izinkan"</li>
          </ol>
        </details>
      </div>

      <button onclick="location.reload()" class="w-full bg-uin-green hover:bg-uin-darkgreen text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
        <i class="fa-solid fa-refresh"></i>
        <span>Muat Ulang Halaman</span>
      </button>
      
      <button onclick="this.parentElement.parentElement.remove()" class="w-full mt-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl transition">
        Gunakan Input Manual
      </button>
    </div>
  `;
  document.body.appendChild(guideDiv);
}

/**
 * Tampilkan opsi input manual jika kamera gagal
 */
function showManualInputOption() {
  const inputSection = document.querySelector('#manual-id-input')?.parentElement;
  if (inputSection) {
    inputSection.style.display = 'block';
    const warningDiv = document.createElement('div');
    warningDiv.className = 'mb-3 p-3 bg-amber-100 border border-amber-300 rounded-lg text-xs text-amber-800';
    warningDiv.innerHTML = `
      <i class="fa-solid fa-triangle-exclamation mr-1"></i>
      <strong>Scanner Kamera Tidak Tersedia</strong> - Gunakan input manual di bawah
    `;
    inputSection.parentElement.insertBefore(warningDiv, inputSection);
  }
}

/**
 * Disable scanner UI
 */
function disableScanner() {
  const readerDiv = document.getElementById('reader');
  if (readerDiv) {
    readerDiv.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-slate-400 text-sm space-y-2 p-4">
        <i class="fa-solid fa-camera-slash text-3xl"></i>
        <p class="text-center">Kamera tidak tersedia atau izin ditolak</p>
        <p class="text-xs text-slate-500">Gunakan input manual untuk melanjutkan</p>
      </div>
    `;
  }
}

/**
 * Play "Terima Kasih" voice ketika QR terdeteksi
 * Menggunakan Web Speech API untuk text-to-speech
 */
function playTerimaKasihSound() {
  try {
    // Cancel previous speech jika ada
    window.speechSynthesis.cancel();
    
    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance('Terima Kasih');
    
    // Set properties
    utterance.lang = 'id-ID'; // Indonesian language
    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Event handlers
    utterance.onstart = () => {
      console.log('✓ Suara "Terima Kasih" mulai diputar');
    };
    
    utterance.onend = () => {
      console.log('✓ Suara "Terima Kasih" selesai');
    };
    
    utterance.onerror = (event) => {
      console.warn('⚠️ Error saat memainkan suara:', event.error);
      // Fallback: play beep jika suara tidak berhasil
      playFallbackBeepSound();
    };
    
    // Play the speech
    window.speechSynthesis.speak(utterance);
    
  } catch (error) {
    console.error('Error initializing speech synthesis:', error);
    // Fallback: play beep
    playFallbackBeepSound();
  }
}

/**
 * Fallback beep sound jika text-to-speech tidak tersedia
 */
function playFallbackBeepSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
    
    console.log('✓ Fallback beep sound dimainkan');
  } catch (error) {
    console.warn('⚠️ Error memainkan fallback beep:', error);
  }
}

/**
 * Toast notification system
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColor = type === 'error' ? 'bg-rose-500' : type === 'success' ? 'bg-emerald-500' : 'bg-blue-500';
  
  toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg text-sm pointer-events-auto animate-slide-in whitespace-pre-line`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing camera handler...');
  // Scanner dimulai saat switchTab('beranda') dipanggil
});

// Cleanup saat page unload
window.addEventListener('beforeunload', async () => {
  await stopQrScanner();
});
