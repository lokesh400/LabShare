const socket = io({
  transports: ['websocket'],
  upgrade: false
});

const screen = document.getElementById('screen');
const waiting = document.getElementById('waiting');
const status = document.getElementById('status');
const fpsDisplay = document.getElementById('fps');

let receiving = false;
let frameCount = 0;
let lastFpsUpdate = Date.now();

socket.emit('join-student');

socket.on('broadcast-started', () => {
  console.log('Broadcast started');
  status.textContent = '🟢 Receiving';
  waiting.style.display = 'none';
  screen.style.display = 'block';
  document.getElementById('fullscreenBtn').style.display = 'block';
  document.getElementById('fpsIndicator').style.display = 'block';
  document.getElementById('ultraBadge').style.display = 'block';
  receiving = true;
});

socket.on('broadcast-stopped', () => {
  console.log('Broadcast stopped');
  stopReceiving();
});

// Receive binary frames (ultra-fast)
socket.on('frame', (arrayBuffer) => {
  if (!receiving) {
    receiving = true;
    waiting.style.display = 'none';
    screen.style.display = 'block';
    document.getElementById('fullscreenBtn').style.display = 'block';
    document.getElementById('fpsIndicator').style.display = 'block';
    document.getElementById('ultraBadge').style.display = 'block';
  }

  // Convert ArrayBuffer to Blob to URL (fastest method)
  const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });

  // Revoke old URL to prevent memory leak
  if (screen.src && screen.src.startsWith('blob:')) {
    URL.revokeObjectURL(screen.src);
  }

  // Set new frame
  screen.src = URL.createObjectURL(blob);

  // Update FPS counter
  frameCount++;
  const now = Date.now();
  if (now - lastFpsUpdate >= 1000) {
    const currentFps = frameCount;
    fpsDisplay.textContent = `${currentFps} FPS`;
    document.getElementById('fpsValue').textContent = currentFps;
    frameCount = 0;
    lastFpsUpdate = now;
  }
});

function stopReceiving() {
  receiving = false;
  screen.style.display = 'none';
  waiting.style.display = 'block';
  document.getElementById('fullscreenBtn').style.display = 'none';
  status.textContent = '⚫ Waiting...';

  if (screen.src && screen.src.startsWith('blob:')) {
    URL.revokeObjectURL(screen.src);
    screen.src = '';
  }
}

// Fullscreen
document.getElementById('fullscreenBtn').onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

socket.on('disconnect', () => {
  stopReceiving();
  status.textContent = '🔴 Disconnected';
});

console.log('Student loaded - optimized for instant playback');
