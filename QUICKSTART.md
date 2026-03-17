# 🚀 Quick Start Guide - LabShare

## Step 1: Install Dependencies

```bash
cd /home/lokesh/Desktop/LabShare
npm install
```

## Step 2: Find Your IP Address

```bash
./get-ip.sh
```

Or manually:
```bash
hostname -I | awk '{print $1}'
```

## Step 3: Start the Server

```bash
npm start
```

You should see:
```
🚀 LabShare Server Running!
================================
📡 Local: http://localhost:3000
🌐 Network: http://<your-ip>:3000

👨‍🏫 Teacher: /teacher
👨‍🎓 Student: /student
================================
```

## Step 4: Open Teacher Interface

On the teacher's computer, open a browser and go to:
```
http://<your-ip>:3000/teacher
```

Example: `http://192.168.1.100:3000/teacher`

## Step 5: Start Sharing

1. Click "▶ Start Sharing" button
2. Select which screen or window to share
3. Click "Share"

## Step 6: Students Connect

On each student computer, open a browser and go to:
```
http://<your-ip>:3000/student
```

Example: `http://192.168.1.100:3000/student`

Students will automatically see the teacher's screen in real-time!

## ✅ That's It!

The system is now running with:
- ✅ Zero lag on local network
- ✅ 15 FPS smooth streaming
- ✅ HD quality (1280x720)
- ✅ Automatic frame dropping to prevent buffering
- ✅ Real-time performance monitoring

## 📊 Monitoring Performance

Both teacher and student interfaces show:
- **FPS**: Current frame rate
- **Latency**: Delay in milliseconds

### Good Performance:
- FPS: ~15 (matching configured rate)
- Latency: <100ms
- No freezing or stuttering

### If experiencing lag:
See `PERFORMANCE.md` for tuning guide

## 🔄 Stopping

**Teacher**: Click "⏹ Stop Sharing"
**Server**: Press `Ctrl+C` in terminal

## 🆘 Troubleshooting

### Students can't connect:
1. Check all devices on same WiFi network
2. Check firewall: `sudo ufw allow 3000/tcp`
3. Verify IP address is correct
4. Test from teacher computer first: `http://localhost:3000/student`

### High lag or freezing:
1. Close other applications
2. Check WiFi signal strength
3. Reduce quality in `public/teacher.js` (see PERFORMANCE.md)
4. Use Ethernet for teacher's computer

### Browser not supported:
Use Chrome, Edge, or Firefox (latest version)

## 💡 Tips

1. **Start teacher interface first** before students connect
2. **Share specific window** instead of entire screen for better performance
3. **Use wired connection** for teacher's computer if possible
4. **Monitor the stats** - adjust settings if FPS drops or latency increases
5. **Close unnecessary apps** to free up CPU and network

## 📁 Important Files

- `public/teacher.js` - Teacher-side settings (FPS, quality, resolution)
- `server.js` - Server configuration
- `PERFORMANCE.md` - Detailed performance tuning
- `README.md` - Complete documentation

---

Need help? Check `README.md` or `PERFORMANCE.md` for more details!
