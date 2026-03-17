const socket = io({ transports: ['websocket'], upgrade: false });

let pc = null;
const video = document.getElementById('screen');
const waiting = document.getElementById('waiting');
const status = document.getElementById('status');

const rtcConfig = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  iceCandidatePoolSize: 10
};

socket.emit('join-student');

socket.on('teacher-ready', () => {
  status.textContent = '🟡 Connecting...';
  document.dispatchEvent(new CustomEvent('stream-connecting'));
  socket.emit('student-join');
});

socket.on('teacher-stopped', () => {
  cleanup();
  document.dispatchEvent(new CustomEvent('stream-stopped'));
  status.textContent = '⚫ Teacher stopped';
  video.style.display = 'none';
  document.getElementById('fullscreenBtn').style.display = 'none';
});

socket.on('offer', async ({ offer }) => {
  try {
    pc = new RTCPeerConnection(rtcConfig);

    pc.ontrack = (e) => {
      if (e.streams && e.streams[0]) {
        video.srcObject = e.streams[0];
        video.style.display = 'block';
        waiting.style.display = 'none';
        document.getElementById('fullscreenBtn').style.display = 'block';
        status.textContent = '🟢 Live';
        // Dispatch event so the view can start polling stats
        document.dispatchEvent(new CustomEvent('stream-live', { detail: { pc } }));
      }
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit('ice-candidate', { candidate: e.candidate });
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') status.textContent = '🟢 Live';
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        cleanup();
        status.textContent = '🔴 Disconnected';
      }
    };

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('answer', { answer });

  } catch (err) {
    console.error('WebRTC error:', err);
    status.textContent = '🔴 Error - Refresh page';
  }
});

socket.on('ice-candidate', async ({ candidate }) => {
  if (pc && candidate) {
    try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (_) {}
  }
});

function cleanup() {
  if (pc) { pc.close(); pc = null; }
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(t => t.stop());
    video.srcObject = null;
  }
}

document.getElementById('fullscreenBtn').onclick = () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
};

socket.on('disconnect', () => { cleanup(); status.textContent = '🔴 Disconnected'; });

console.log('Student WebRTC ready');
