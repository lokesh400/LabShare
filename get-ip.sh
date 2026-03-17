#!/bin/bash

echo ""
echo "🔍 Finding your network IP address..."
echo ""

# Try different methods to get IP
if command -v hostname &> /dev/null; then
    IP=$(hostname -I 2>/dev/null | awk '{print $1}')
fi

if [ -z "$IP" ]; then
    IP=$(ip route get 1 2>/dev/null | awk '{print $7}' | head -n1)
fi

if [ -z "$IP" ]; then
    IP=$(ifconfig 2>/dev/null | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n1)
fi

if [ -n "$IP" ]; then
    echo "✅ Your network IP address: $IP"
    echo ""
    echo "📡 Use these URLs:"
    echo "   Teacher: http://$IP:3000/teacher"
    echo "   Student: http://$IP:3000/student"
    echo ""
else
    echo "❌ Could not detect IP address automatically"
    echo "   Run: hostname -I"
    echo "   Or: ip addr show"
fi
