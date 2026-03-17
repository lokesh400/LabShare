# LabShare - Performance Tuning Guide

## 🚀 Current Optimized Settings (NO LAG)

The system is now configured for ULTRA-LOW LATENCY on local networks:

### Teacher Side (`public/teacher.js`)
```javascript
frameRate: 15      // Lower FPS = smoother, less CPU usage
quality: 0.5       // Lower quality = faster transmission
maxWidth: 1280     // HD resolution (not Full HD)
maxHeight: 720
```

### Server Side (`server.js`)
- WebSocket-only transport (no polling fallback)
- Disabled compression (already using JPEG)
- 2MB buffer for fast transmission
- Frame dropping enabled (volatile emit)

## 📊 Performance Levels

### ULTRA FAST (Current - Zero Lag)
```javascript
// In public/teacher.js
frameRate: 15
quality: 0.5
maxWidth: 1280
maxHeight: 720
```
**Expected:** <50ms latency, 15 FPS, very smooth

### BALANCED (Good Quality + Fast)
```javascript
frameRate: 20
quality: 0.6
maxWidth: 1280
maxHeight: 720
```
**Expected:** 50-100ms latency, 20 FPS, smooth

### HIGH QUALITY (Better visual)
```javascript
frameRate: 24
quality: 0.7
maxWidth: 1920
maxHeight: 1080
```
**Expected:** 100-150ms latency, 24 FPS, some lag possible

### MAXIMUM QUALITY (May lag)
```javascript
frameRate: 30
quality: 0.8
maxWidth: 1920
maxHeight: 1080
```
**Expected:** 150-300ms latency, 30 FPS, likely to lag

## 🔧 How to Adjust Settings

1. **Open** `public/teacher.js`
2. **Find** the `CAPTURE_CONFIG` section (around line 24)
3. **Modify** the values based on your needs
4. **Save** and refresh the teacher's browser

## 🎯 Troubleshooting Lag

### If Still Lagging:

1. **Lower Frame Rate**
   ```javascript
   frameRate: 10  // Even smoother
   ```

2. **Reduce Quality Further**
   ```javascript
   quality: 0.4  // Minimum for readability
   ```

3. **Lower Resolution**
   ```javascript
   maxWidth: 960   // DVD quality
   maxHeight: 540
   ```

4. **Check Network**
   - Ensure all devices on same WiFi network
   - Use 5GHz WiFi if available
   - Connect teacher's laptop via Ethernet cable

5. **Close Other Applications**
   - Close browser tabs
   - Close video players
   - Disable antivirus temporarily

## 💡 Understanding the Trade-offs

| Setting | Speed | Quality | Bandwidth |
|---------|-------|---------|-----------|
| frameRate | ↓ faster | ↓ less smooth | ↓ less |
| quality | ↓ faster | ↓ pixelated | ↓ less |
| resolution | ↓ faster | ↓ smaller | ↓ less |

## 📈 Real-Time Monitoring

Both teacher and student interfaces show:
- **FPS**: Frames per second being transmitted/received
- **Latency**: Delay between capture and display (ms)

### Good Performance Indicators:
- FPS close to configured frameRate
- Latency < 100ms
- No stuttering or freezing

### Bad Performance Indicators:
- FPS drops significantly below configured rate
- Latency > 200ms
- Screen freezes or stutters

## 🏆 Best Practices

1. **Start Teacher First**: Always open teacher interface before students
2. **Stable Connection**: Keep teacher's laptop plugged in and connected via Ethernet
3. **Close Apps**: Shut down unnecessary applications on teacher's computer
4. **Browser**: Use Chrome or Edge (best performance)
5. **Monitor Stats**: Watch the FPS/latency indicators
6. **Adjust Live**: Can change settings and refresh without restarting server

## 🔍 What Each Optimization Does

### Frame Rate (FPS)
- **Lower**: Less CPU usage, less network traffic, smoother delivery
- **Higher**: More fluid motion but needs more processing

### Quality (0.1 - 1.0)
- **Lower**: Smaller file size, faster transmission, more compression artifacts
- **Higher**: Better image quality, larger files, slower transmission

### Resolution
- **Lower**: Easier to process, faster to send, less detailed
- **Higher**: More detail, harder to process, slower transmission

### Volatile Emit
- Automatically drops frames if student can't keep up
- Prevents buffer buildup and increasing lag
- Student always sees most recent frame

### WebSocket-Only Transport
- Faster than HTTP long-polling
- Lower overhead
- Better for real-time data

### No Compression
- JPEG already compressed
- Disabling Socket.io compression saves CPU
- Faster transmission on local network

## 📝 Current Configuration Summary

✅ Frame skipping on teacher side (if previous frame still sending)
✅ Frame skipping on student side (if image still loading)
✅ Volatile emission (drops frames to prevent lag buildup)
✅ Synchronous canvas.toDataURL (faster than blob conversion)
✅ WebSocket-only transport
✅ Disabled unnecessary compression
✅ Optimized buffer sizes
✅ Direct image updates

**Result**: Near-zero lag on local network! 🎉

## 🆘 Emergency "Just Make It Work" Settings

If nothing else works, use these MINIMUM settings:

```javascript
frameRate: 8
quality: 0.3
maxWidth: 800
maxHeight: 600
```

This will work on even the slowest networks, though quality will be reduced.
