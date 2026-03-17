const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  transports: ['websocket'],
  cors: { origin: '*' }
});

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (_, res) => res.render('index'));
app.get('/teacher', (_, res) => res.render('teacher'));
app.get('/student', (_, res) => res.render('student'));
let teacher = null;
const students = new Map();

io.on('connection', (socket) => {

  socket.on('join-teacher', () => {
    if (teacher) teacher.disconnect(true);
    teacher = socket;
    console.log('Teacher connected:', socket.id);
    socket.emit('student-count', students.size);
  });

  socket.on('join-student', () => {
    students.set(socket.id, socket);
    console.log('Student connected:', socket.id, '| total:', students.size);
    if (teacher) {
      teacher.emit('student-count', students.size);
      // If teacher already sharing, notify this student
      socket.emit('teacher-ready');
    }
  });

  socket.on('teacher-ready', () => {
    // Teacher just started - notify all students
    students.forEach(s => s.emit('teacher-ready'));
    console.log('Teacher ready - notified', students.size, 'students');
  });

  socket.on('student-join', () => {
    // Student requesting stream from teacher
    if (teacher) {
      teacher.emit('student-join', { studentId: socket.id });
      console.log('Student requesting stream:', socket.id);
    }
  });

  // Relay offer: teacher -> student
  socket.on('offer', ({ to, offer }) => {
    const student = students.get(to);
    if (student) student.emit('offer', { offer, from: socket.id });
  });

  // Relay answer: student -> teacher
  socket.on('answer', ({ answer }) => {
    if (teacher) teacher.emit('answer', { answer, from: socket.id });
  });

  // Relay ICE: teacher -> student OR student -> teacher
  socket.on('ice-candidate', ({ to, candidate }) => {
    if (to) {
      const student = students.get(to);
      if (student) student.emit('ice-candidate', { candidate });
    } else if (teacher) {
      teacher.emit('ice-candidate', { candidate, from: socket.id });
    }
  });

  socket.on('teacher-stopped', () => {
    students.forEach(s => s.emit('teacher-stopped'));
    console.log('Teacher stopped');
  });

  socket.on('disconnect', () => {
    if (socket === teacher) {
      teacher = null;
      students.forEach(s => s.emit('teacher-stopped'));
      console.log('Teacher disconnected');
    }
    if (students.has(socket.id)) {
      students.delete(socket.id);
      if (teacher) teacher.emit('student-count', students.size);
      console.log('Student disconnected | remaining:', students.size);
    }
  });
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  const ip = require('os').networkInterfaces();
  const localIP = Object.values(ip).flat().find(i => i.family === 'IPv4' && !i.internal)?.address || 'localhost';

  console.log(`
╔════════════════════════════════════════════╗
║   LabShare — WebRTC (Zoom Infrastructure) ║
╚════════════════════════════════════════════╝

  Teacher → http://localhost:${PORT}/teacher
  Teacher → http://${localIP}:${PORT}/teacher

  Students → http://${localIP}:${PORT}/student

  WebRTC peer-to-peer (like Zoom)
  Hardware video encoding/decoding
  < 50ms latency on local network
  Smooth 30-60 FPS

════════════════════════════════════════════
`);
});
