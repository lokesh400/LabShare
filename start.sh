#!/bin/bash

clear

echo "╔═══════════════════════════════════════════════╗"
echo "║    🚀 LabShare ULTRA - Performance Mode      ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Kill old server
echo "🛑 Stopping any existing servers..."
pkill -f "node.*server.js" 2>/dev/null
sleep 1

# Get IP address
IP=$(hostname -I 2>/dev/null | awk '{print $1}')
if [ -z "$IP" ]; then
  IP="<your-ip>"
fi

# Start server
echo "🚀 Starting ULTRA performance server..."
echo ""

cd /home/lokesh/Desktop/LabShare
npm start &

sleep 3

clear

cat << EOF
╔═══════════════════════════════════════════════════════╗
║       ⚡ LabShare ULTRA - Server Running!  ⚡         ║
╚═══════════════════════════════════════════════════════╝

📍 Network IP: $IP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👨‍🏫 TEACHER (Control Panel)

   🌐 http://localhost:3000/teacher

   or from other computers:

   🌐 http://$IP:3000/teacher

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👨‍🎓 STUDENTS (All Lab Computers)

   🌐 http://$IP:3000/student

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ ULTRA PERFORMANCE FEATURES

   🎯 Zero-lag binary streaming
   🔥 60 FPS capable
   👥 200+ simultaneous users
   📊 Real-time monitoring
   💾 10MB frame buffer
   🚀 Hardware accelerated

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Expected Performance:

   Localhost:     10-30ms latency  | 60 FPS
   Gigabit LAN:   20-50ms latency  | 60 FPS
   Fast WiFi:     30-80ms latency  | 40-60 FPS
   Regular WiFi:  50-150ms latency | 30-40 FPS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 Documentation:
   - ULTRA-GUIDE.md    (Performance guide)
   - WEBRTC-GUIDE.md   (Technical details)
   - README.md         (General usage)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⌨️  Press Ctrl+C to stop server

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF

wait
