#!/bin/bash

echo "================================"
echo "LabShare Restart & Test"
echo "================================"
echo ""

# Kill any process on port 3000
echo "🛑 Stopping existing server..."
pkill -f "node.*server.js" 2>/dev/null || true
sleep 1

# Start server
echo "🚀 Starting server..."
cd /home/lokesh/Desktop/LabShare
npm start &
SERVER_PID=$!

sleep 3

echo ""
echo "✅ Server started (PID: $SERVER_PID)"
echo ""
echo "================================"
echo "📋 What to do now:"
echo "================================"
echo ""
echo "1️⃣  TEACHER - Open in browser:"
echo "   http://localhost:3000/teacher"
echo ""
echo "2️⃣  Press F12 to open console"
echo ""
echo "3️⃣  Click 'Start Sharing'"
echo "   You should see in console:"
echo "   - 'Start button clicked!'"
echo "   - 'Display media granted!'"
echo "   - 'FPS: 15' (every second)"
echo ""
echo "4️⃣  STUDENT - Open in another tab/window:"
echo "   http://localhost:3000/student"
echo ""
echo "5️⃣  Press F12 to open console"
echo "   You should see in console:"
echo "   - 'Student socket connected'"
echo "   - 'Teacher started sharing!'"
echo "   - 'Frame received!' (repeatedly)"
echo ""
echo "6️⃣  Check server terminal for:"
echo "   - 'Teacher connected'"
echo "   - 'Student connected'"
echo "   - 'Broadcasting frame #30...'"
echo ""
echo "================================"
echo "Press Ctrl+C to stop server"
echo "================================"
echo ""

# Wait for user to stop
wait $SERVER_PID
