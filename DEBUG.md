# 🔍 Student Not Seeing Screen - Debug Guide

## What I Fixed:

1. ✅ Increased buffer size back to 5MB (was too small at 2MB)
2. ✅ Re-enabled polling fallback (websocket-only was too strict)
3. ✅ Added extensive console logging
4. ✅ Added frame size monitoring
5. ✅ Added server-side broadcast logging

## 🚀 How to Test:

### Option 1: Use the restart script (easiest)
```bash
cd /home/lokesh/Desktop/LabShare
./restart.sh
```

### Option 2: Manual restart
```bash
# Stop old server
pkill -f "node.*server.js"

# Start new server
cd /home/lokesh/Desktop/LabShare
npm start
```

## 📋 Step-by-Step Testing:

### 1. Open Teacher Interface
```
http://localhost:3000/teacher
```

- Press `F12` to open console
- Click "Start Sharing"
- Allow screen capture

**Expected console output:**
```
Start button clicked!
Requesting display media...
Display media granted!
Video dimensions: 1920 x 1080
Canvas dimensions: 1280 x 720
Starting capture...
startCapture() called
Frame capture interval started. Interval ID: 2
Frame size: 85 KB
FPS: 15
```

### 2. Check Server Terminal

**Expected server output:**
```
Teacher connected: <socket-id>
Client connected: <socket-id>
```

### 3. Open Student Interface (in another tab)
```
http://localhost:3000/student
```

- Press `F12` to open console

**Expected console output:**
```
Student interface loaded
Student socket connected: <socket-id>
Teacher started sharing!
Frame received! Size: 123456 bytes
Frame received! Size: 123456 bytes
(repeatedly)
First frame received - showing screen
Student FPS: 15 Latency: 45 ms
```

### 4. Check Server Terminal Again

**Expected server output:**
```
Student connected: <socket-id> - Total students: 1
Broadcasting frame #30 to 1 students
Broadcasting frame #60 to 1 students
```

## 🐛 Troubleshooting by Console Messages:

### Teacher Console Shows:
- ✅ "Start button clicked!" - Button works
- ✅ "Display media granted!" - Permission granted
- ✅ "FPS: 15" - Frames being captured
- ❌ Nothing - Refresh page with Ctrl+F5

### Student Console Shows:
- ✅ "Student socket connected" - Socket works
- ✅ "Teacher started sharing!" - Received signal
- ✅ "Frame received!" - Frames arriving
- ❌ No "Frame received!" - Keep reading below

## 🔧 If Student Sees No Frames:

### Check 1: Are frames being sent?
**Teacher console should show**: "FPS: 15" every second
**Server terminal should show**: "Broadcasting frame #30 to 1 students"

### Check 2: Frame size too large?
**Teacher console shows**: "Frame size: XXX KB"
- If over 500KB, the quality/resolution is too high
- Edit `public/teacher.js` line 27-29:
  ```javascript
  quality: 0.3,     // Lower quality
  maxWidth: 960,    // Lower resolution
  maxHeight: 540
  ```

### Check 3: Socket connection issues?
**Student console should show**: "Student socket connected: <id>"
- If not, check if student and teacher are on same network
- Try opening student on same computer first: `http://localhost:3000/student`

### Check 4: Browser compatibility?
- Use **Chrome** or **Edge** (recommended)
- Firefox should work but may be slower
- Safari has limited support

## 🎯 Quick Fix Checklist:

- [ ] Server is running (`npm start`)
- [ ] Teacher page refreshed with Ctrl+F5
- [ ] Student page refreshed with Ctrl+F5
- [ ] Teacher clicked "Start Sharing" and allowed
- [ ] Console open on both pages (F12)
- [ ] Both pages show socket connected
- [ ] Teacher shows FPS counter updating
- [ ] Server shows "Broadcasting frame" messages

## 📊 What Each Log Message Means:

| Message | Location | Meaning |
|---------|----------|---------|
| "Start button clicked!" | Teacher console | Button works |
| "Display media granted!" | Teacher console | Permission given |
| "FPS: 15" | Teacher console | Capturing frames |
| "Frame size: 85 KB" | Teacher console | Frame data size |
| "Teacher connected" | Server terminal | Teacher socket OK |
| "Student connected" | Server terminal | Student socket OK |
| "Broadcasting frame #30" | Server terminal | Sending to students |
| "Student socket connected" | Student console | Connected to server |
| "Teacher started sharing!" | Student console | Received start signal |
| "Frame received!" | Student console | ✅ **WORKING!** |

## 💡 Most Common Issue:

**Frame size too large for buffer!**

If teacher console shows "Frame size: 500 KB" or more, the frames are being rejected by the socket.

**Solution**: Lower quality and resolution in `public/teacher.js`:
```javascript
const CAPTURE_CONFIG = {
  frameRate: 15,
  quality: 0.3,      // ← Lower this (was 0.5)
  maxWidth: 960,     // ← Lower this (was 1280)
  maxHeight: 540     // ← Lower this (was 720)
};
```

Then refresh teacher browser (Ctrl+F5) and start sharing again.

---

## 🆘 Still Not Working?

**Send me these logs:**

1. Teacher console output (all of it)
2. Student console output (all of it)
3. Server terminal output (last 20 lines)
4. Frame size shown in teacher console

This will help identify the exact issue!
