# LabShare - Ultra-Fast Screen Sharing for Labs

A high-performance, real-time screen sharing system designed specifically for lab environments. Share the teacher's screen to multiple student computers with minimal latency over a local network.

## Features

✨ **Ultra-Low Latency** - Optimized for local network, typically <100ms delay
🚀 **High Performance** - Smooth 30 FPS streaming
📡 **No Internet Required** - Works entirely on local WiFi/LAN
👥 **Multiple Students** - Support unlimited concurrent viewers
🖥️ **Full Screen Support** - Fullscreen mode on student devices
📊 **Real-time Stats** - FPS and latency monitoring
🎯 **Easy to Use** - Simple interface for teachers and students

## System Requirements

- Node.js v14 or higher
- Modern web browser (Chrome, Firefox, Edge - with Screen Capture API support)
- Local network (WiFi or LAN)

## Installation

1. Navigate to the project directory:
```bash
cd LabShare
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Starting the Server

Run the server:
```bash
npm start
```

For development (with auto-restart):
```bash
npm run dev
```

The server will start and display:
```
🚀 LabShare Server Running!
================================
📡 Local: http://localhost:3000
🌐 Network: http://<your-ip>:3000

👨‍🏫 Teacher: /teacher
👨‍🎓 Student: /student
================================
```

### Finding Your Network IP

**On Linux/Mac:**
```bash
hostname -I | awk '{print $1}'
```
or
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi/Ethernet adapter.

### For the Teacher

1. Open browser and go to: `http://<server-ip>:3000/teacher`
2. Click "▶ Start Sharing"
3. Select which screen or window to share
4. Students will now see your screen in real-time

### For Students

1. Open browser and go to: `http://<server-ip>:3000/student`
2. Wait for teacher to start sharing
3. Click "⛶ Fullscreen" for immersive viewing
4. Screen will automatically update in real-time

## Network Setup

### Ensuring All Computers are on Same Network

1. **Check WiFi Network**: All devices must connect to the same WiFi network
2. **Check Firewall**: Ensure port 3000 is not blocked
3. **Test Connection**: From student computer, ping the server IP:
   ```bash
   ping <server-ip>
   ```

### Opening Firewall (if needed)

**Ubuntu/Linux:**
```bash
sudo ufw allow 3000/tcp
```

**Windows:**
1. Open Windows Firewall
2. Add inbound rule for port 3000
3. Allow TCP connections

## Performance Optimization

**The system is pre-configured for ZERO LAG on local networks!**

Current optimized settings:
- **15 FPS** - Smooth delivery without overwhelming the network
- **50% JPEG quality** - Perfect balance of speed and clarity
- **1280x720 resolution** - HD quality with fast transmission
- **WebSocket-only** - No polling overhead
- **Frame dropping** - Automatically skips frames to prevent lag buildup
- **Optimized buffers** - Fast transmission without memory bloat

### If you still experience lag:

1. **Lower settings in `public/teacher.js`**:
   ```javascript
   frameRate: 10,      // Even slower but smoother
   quality: 0.4,       // Lower quality
   maxWidth: 960,      // Smaller resolution
   maxHeight: 540
   ```

2. **Check your network**: Ensure strong WiFi signal or use Ethernet

3. **See `PERFORMANCE.md`** for detailed tuning guide

### Recommended Settings by Network:

| Network Type | frameRate | quality | Resolution | Expected Latency |
|-------------|-----------|---------|------------|-----------------|
| **Gigabit LAN** | 24-30 | 0.7-0.8 | 1920x1080 | <50ms |
| **Fast WiFi (5GHz)** ✅ | 15-20 | 0.5-0.6 | 1280x720 | <100ms |
| **Regular WiFi** | 10-15 | 0.5 | 1280x720 | <150ms |
| **Slow Network** | 8-10 | 0.4 | 960x540 | <200ms |

✅ = Current configuration (optimal for most labs)

## Troubleshooting

### Students Can't Connect
- Verify all devices are on same network
- Check firewall settings
- Ensure server IP address is correct
- Try accessing from server computer first (`http://localhost:3000`)

### High Latency/Lag
- Reduce `frameRate` in teacher.js
- Lower `quality` setting
- Reduce resolution (maxWidth/maxHeight)
- Close other applications using network
- Use wired connection for teacher's computer

### Screen Not Showing
- Teacher must click "Start Sharing" and grant permission
- Ensure browser supports Screen Capture API (use Chrome/Edge)
- Try refreshing the student's page
- Check browser console for errors (F12)

### Black Screen
- Teacher may have selected "Entire Screen" but has permission issues
- Try sharing a specific window instead
- Restart browser with admin privileges

## Architecture

```
┌─────────────┐
│   Teacher   │ ← Captures screen at 30 FPS
│  (Browser)  │ ← Compresses to JPEG
└──────┬──────┘
       │ Socket.io (WebSocket)
       ↓
┌─────────────┐
│   Server    │ ← Node.js + Express
│  (socket.io)│ ← Broadcasts frames
└──────┬──────┘
       │ Socket.io (WebSocket)
       ↓
┌─────────────┐
│  Students   │ ← Receive frames
│  (Browsers) │ ← Display in real-time
└─────────────┘
```

## Technical Details

- **Frontend**: Vanilla JavaScript + Socket.io Client
- **Backend**: Node.js + Express + Socket.io
- **Streaming**: JPEG compression over WebSocket
- **Capture**: Screen Capture API (getDisplayMedia)
- **Optimization**: Canvas-based frame capture with configurable quality

## Browser Compatibility

| Browser | Teacher | Student |
|---------|---------|---------|
| Chrome 72+ | ✅ | ✅ |
| Edge 79+ | ✅ | ✅ |
| Firefox 66+ | ✅ | ✅ |
| Safari 13+ | ⚠️ Limited | ✅ |

## Tips for Best Experience

1. **Use Wired Connection** for teacher's computer
2. **Close Unnecessary Apps** to free up bandwidth
3. **Share Specific Window** instead of entire screen for better performance
4. **Use 5GHz WiFi** if available (faster than 2.4GHz)
5. **Position Router Centrally** to ensure good signal to all computers
6. **Update Browser** to latest version

## Security Notes

- This system is designed for LOCAL network use only
- Do not expose the server to the internet without proper authentication
- Be careful what you share - students see everything on your screen
- Consider sharing specific windows instead of entire screen

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify network connectivity
3. Check browser console for errors (F12)
4. Ensure all dependencies are installed correctly

---

Made with ❤️ for hassle-free lab teaching
# LabShare
