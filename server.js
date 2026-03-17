const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  // Optimized for 200+ connections
  perMessageDeflate: false, // Disable compression for speed on local network
  httpCompression: false,
  transports: ['websocket'],
  allowUpgrades: false,
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 10e6, // 10MB for high quality frames
  cors: { origin: "*" }
});

app.use(express.static('public'));
app.set('view engine', 'ejs');

let teacher = null;
let students = new Set();
let frameCount = 0;
let broadcastActive = false;

app.get('/', (req, res) => res.render('index'));
app.get('/teacher', (req, res) => res.render('teacher'));
app.get('/student', (req, res) => res.render('student'));

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('join-teacher', () => {
    if (teacher) {
      console.log('Replacing previous teacher');
      teacher.disconnect();
    }
    teacher = socket;
    socket.isTeacher = true;
    console.log('✅ Teacher connected:', socket.id);

    // Send current student count
    socket.emit('student-count', students.size);
  });

  socket.on('join-student', () => {
    students.add(socket);
    socket.isStudent = true;
    console.log('✅ Student connected:', socket.id, '| Total:', students.size);

    // Notify teacher
    if (teacher) {
      teacher.emit('student-count', students.size);
    }

    // If broadcast is active, notify new student
    if (broadcastActive) {
      socket.emit('broadcast-started');
    }
  });

  socket.on('start-broadcast', () => {
    if (socket.isTeacher) {
      broadcastActive = true;
      frameCount = 0;
      console.log('📡 Broadcast started');

      // Notify all students
      students.forEach(student => {
        student.emit('broadcast-started');
      });
    }
  });

  socket.on('stop-broadcast', () => {
    if (socket.isTeacher) {
      broadcastActive = false;
      console.log('⏹ Broadcast stopped | Frames sent:', frameCount);

      // Notify all students
      students.forEach(student => {
        student.emit('broadcast-stopped');
      });
    }
  });

  // Receive and broadcast frame (binary data)
  socket.on('frame', (arrayBuffer) => {
    if (!socket.isTeacher || students.size === 0) return;

    frameCount++;

    // Log stats every 100 frames
    if (frameCount % 100 === 0) {
      const sizeKB = Math.round(arrayBuffer.byteLength / 1024);
      console.log(`Frame #${frameCount} | Size: ${sizeKB}KB | Students: ${students.size}`);
    }

    // Efficient broadcast to all students
    // Using volatile to skip frames for slow clients (prevents lag buildup)
    students.forEach(student => {
      student.volatile.emit('frame', arrayBuffer);
    });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);

    if (socket.isTeacher) {
      teacher = null;
      broadcastActive = false;
      console.log('❌ Teacher disconnected');

      // Notify all students
      students.forEach(student => {
        student.emit('broadcast-stopped');
      });
    }

    if (socket.isStudent) {
      students.delete(socket);
      console.log('❌ Student disconnected | Remaining:', students.size);

      // Update teacher
      if (teacher) {
        teacher.emit('student-count', students.size);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║     🚀 LabShare Ultra - High Performance      ║
╚═══════════════════════════════════════════════╝

📡 Server: http://localhost:${PORT}
👨‍🏫 Teacher: /teacher
👨‍🎓 Student: /student

⚡ Optimized for 200+ simultaneous users
🎯 Zero-lag binary streaming
🔥 60 FPS capable
💾 10MB frame buffer

═══════════════════════════════════════════════
`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  io.close(() => {
    process.exit(0);
  });
});
