# 🚀 LabShare - Fresh Start with WebRTC

## What Changed?

I completely rebuilt the system using **WebRTC** (the same technology used by Zoom, Google Meet, and WhatsApp).

### Why WebRTC is Better:

✅ **Zero lag** - Direct peer-to-peer streaming
✅ **Smooth 30 FPS** - Browser handles optimization automatically
✅ **Adaptive quality** - Adjusts to network conditions
✅ **Full HD** - Up to 1920x1080 resolution
✅ **Low latency** - Typically < 100ms on local network

## 🎯 How to Use

### 1. Start the Server

```bash
cd /home/lokesh/Desktop/LabShare

# Kill any old server
pkill -f "node.*server.js"

# Start new server
npm start
```

### 2. Teacher Side

Open in browser:
```
http://localhost:3000/teacher
```

1. Click **"Start Sharing"**
2. Select screen or window to share
3. Click **"Share"**
4. That's it! Students will connect automatically

### 3. Student Side

Open in browser (can be same or different computer):
```
http://localhost:3000/student
```

or if on different computer:
```
http://YOUR-IP:3000/student
```

**Students will see the screen automatically** when teacher starts sharing!

## 🔍 How It Works

### Old System (JPEG streaming):
```
Teacher → Capture frame → Convert to JPEG → Send via Socket.io → Student displays
(High CPU, lag, buffer issues)
```

### New System (WebRTC):
```
Teacher → WebRTC peer connection → Direct stream → Student
(Browser optimized, smooth, no lag)
```

## ⚡ Features

- **Automatic quality adjustment** - Adapts to network speed
- **Direct streaming** - No server processing
- **Built-in optimization** - Browser handles encoding/decoding
- **Low CPU usage** - Hardware acceleration
- **Smooth playback** - No frame skipping or buffering

## 🛠️ Testing

### Step 1: Test on Same Computer First

1. Open teacher: `http://localhost:3000/teacher`
2. Start sharing
3. Open student in new tab: `http://localhost:3000/student`
4. You should see smooth, lag-free streaming!

### Step 2: Test on Different Computers (Lab Setup)

1. Find your IP address:
   ```bash
   hostname -I | awk '{print $1}'
   ```

2. Teacher opens:
   ```
   http://YOUR-IP:3000/teacher
   ```

3. Students open:
   ```
   http://YOUR-IP:3000/student
   ```

## 📊 Expected Performance

| Network | Latency | FPS | Quality |
|---------|---------|-----|---------|
| Localhost | < 50ms | 30 | 1080p |
| Fast WiFi (5GHz) | 50-100ms | 30 | 1080p |
| Regular WiFi | 100-200ms | 24-30 | 720p |

## 🐛 Troubleshooting

### Teacher can't start sharing
- Use Chrome, Edge, or Firefox (latest version)
- Allow screen capture permission
- Press **F12** to see console errors

### Student sees nothing
- Make sure teacher clicked "Start Sharing"
- Refresh student page
- Check console (F12) for errors
- Make sure both are on same network

### Lag or stuttering
- Check WiFi signal strength
- Close other applications
- Use Ethernet for teacher's computer
- Move closer to WiFi router

## 📝 Console Commands for Debugging

Open browser console (F12) to see:

**Teacher console:**
```
Teacher loaded
Teacher ready, stream started
Student joined: socket-id
Offer sent to student: socket-id
```

**Student console:**
```
Student loaded
Teacher is ready, requesting stream...
Offer received
Stream received!
```

**Server terminal:**
```
✅ Teacher joined: socket-id
✅ Student joined: socket-id
📡 Teacher ready, notifying all students
Student requesting stream: socket-id
```

## 🎉 That's It!

The system is now using **professional-grade WebRTC streaming** like Zoom and Google Meet. It should be smooth, fast, and lag-free!

---

## 🆘 Still Having Issues?

1. Make sure server is running: `npm start`
2. Check browser console (F12) for errors
3. Verify both teacher and students are on same network
4. Try restarting server and refreshing browsers
5. Use Chrome or Edge for best compatibility

Enjoy smooth, professional screen sharing! 🚀
