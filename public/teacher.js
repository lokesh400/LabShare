const socket = io({
  transports: ['websocket'],
  upgrade: false
});

let stream = null;
let peerConnections = {}; // studentId -> RTCPeerConnection
let isSharing = false;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const preview = document.getElementById('preview');
const placeholder = document.getElementById('placeholder');
const status = document.getElementById('status');
const connectedCount = document.getElementById('connectedCount');

socket.emit('join-teacher');

socket.on('student-count', (count) => {
  connectedCount.textContent = `${count} student${count !== 1 ? 's' : ''}`;
  document.dispatchEvent(new CustomEvent('student-count-updated', { detail: { count } }));
});

// WebRTC Configuration (optimized for local network)
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 10
};

startBtn.onclick = async () => {
  try {
    // Get screen with FULL quality - let browser handle encoding
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always',
        displaySurface: 'monitor',
        logicalSurface: true,
        frameRate: { ideal: 30, max: 60 },
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 }
      },
      audio: false
    });

    preview.srcObject = stream;
    preview.style.display = 'block';
    placeholder.style.display = 'none';

    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();

    // Stop when user clicks browser's stop sharing button
    videoTrack.onended = () => stopSharing();

    isSharing = true;
    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    status.textContent = '🟢 Live';

    // Tell server we're ready
    socket.emit('teacher-ready');

    // Notify UI
    document.dispatchEvent(new CustomEvent('sharing-started', { detail: { width: settings.width, height: settings.height } }));

    console.log('WebRTC Broadcasting:', settings.width, 'x', settings.height);

  } catch (err) {
    console.error('Error:', err);
    alert('Failed to start: ' + err.message);
  }
};

stopBtn.onclick = stopSharing;

function stopSharing() {
  isSharing = false;

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  // Close all peer connections
  Object.values(peerConnections).forEach(pc => pc.close());
  peerConnections = {};

  preview.srcObject = null;
  preview.style.display = 'none';
  placeholder.style.display = 'block';

  startBtn.style.display = 'inline-block';
  stopBtn.style.display = 'none';
  status.textContent = '⚫ Offline';

  socket.emit('teacher-stopped');
  document.dispatchEvent(new CustomEvent('sharing-stopped'));
}

// Student wants to join
socket.on('student-join', async ({ studentId }) => {
  console.log('Student joining:', studentId);

  if (!isSharing || !stream) return;

  try {
    // Create peer connection for this student
    const pc = new RTCPeerConnection(rtcConfig);
    peerConnections[studentId] = pc;

    // Add our stream tracks to the connection
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          to: studentId,
          candidate: event.candidate
        });
      }
    };

    // Monitor connection state
    pc.onconnectionstatechange = () => {
      console.log(`Student ${studentId}: ${pc.connectionState}`);
    };

    // Create offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Send offer to student
    socket.emit('offer', {
      to: studentId,
      offer: offer
    });

  } catch (err) {
    console.error('Error creating peer connection:', err);
  }
});

// Receive answer from student
socket.on('answer', async ({ from, answer }) => {
  const pc = peerConnections[from];
  if (pc) {
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('Answer set for student:', from);
    } catch (err) {
      console.error('Error setting answer:', err);
    }
  }
});

// Receive ICE candidate from student
socket.on('ice-candidate', async ({ from, candidate }) => {
  const pc = peerConnections[from];
  if (pc && candidate) {
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error('Error adding ICE candidate:', err);
    }
  }
});

// Student disconnected
socket.on('student-left', ({ studentId }) => {
  if (peerConnections[studentId]) {
    peerConnections[studentId].close();
    delete peerConnections[studentId];
    console.log('Student left:', studentId);
  }
});

socket.on('disconnect', () => {
  stopSharing();
});

console.log('Teacher WebRTC ready (Zoom-like infrastructure)');
