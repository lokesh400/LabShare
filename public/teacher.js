const socket = io({
  transports: ['websocket'],
  upgrade: false
});

let stream = null;
let canvas = null;
let ctx = null;
let capturing = false;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const preview = document.getElementById('preview');
const placeholder = document.getElementById('placeholder');
const status = document.getElementById('status');
const connectedCount = document.getElementById('connectedCount');

socket.emit('join-teacher');

// Update connected students count
socket.on('student-count', (count) => {
  connectedCount.textContent = `${count} student${count !== 1 ? 's' : ''} connected`;
});

startBtn.onclick = async () => {
  try {
    // Capture screen with optimal settings for local network
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 },
        frameRate: { ideal: 60, max: 60 }, // Higher FPS for ultra-smooth
        cursor: 'always'
      }
    });

    preview.srcObject = stream;
    preview.style.display = 'block';
    placeholder.style.display = 'none';

    // Create canvas for efficient frame capture
    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();

    canvas = new OffscreenCanvas(settings.width, settings.height);
    ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
      willReadFrequently: true
    });

    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    status.textContent = '🟢 Broadcasting';

    socket.emit('start-broadcast');
    capturing = true;
    captureFrames();

    console.log('Broadcasting started:', settings.width, 'x', settings.height, '@', settings.frameRate, 'fps');

  } catch (err) {
    console.error('Error:', err);
    alert('Failed to start: ' + err.message);
  }
};

stopBtn.onclick = () => {
  capturing = false;

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  preview.srcObject = null;
  preview.style.display = 'none';
  placeholder.style.display = 'block';

  startBtn.style.display = 'inline-block';
  stopBtn.style.display = 'none';
  status.textContent = '⚫ Not Broadcasting';

  socket.emit('stop-broadcast');
};

// Ultra-fast frame capture using requestVideoFrameCallback
async function captureFrames() {
  if (!capturing) return;

  try {
    // Draw frame
    ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);

    // Convert to JPEG blob (hardware accelerated)
    const blob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality: 0.6 // Balanced quality for speed
    });

    // Send as binary (much faster than base64)
    const arrayBuffer = await blob.arrayBuffer();
    socket.emit('frame', arrayBuffer);

  } catch (err) {
    console.error('Capture error:', err);
  }

  // Use requestAnimationFrame for perfect timing
  requestAnimationFrame(captureFrames);
}

socket.on('disconnect', () => {
  alert('Disconnected from server');
});

console.log('Teacher loaded - optimized for 200+ users');
