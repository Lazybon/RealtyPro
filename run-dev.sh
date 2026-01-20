#!/bin/bash

# Start Apollo Server in background
echo "Starting Apollo Server on port 4000..."
cd apps/server && npx tsx watch src/index.ts &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Start Next.js on port 5000
echo "Starting Next.js on port 5000..."
cd apps/web && npx next dev -p 5000 -H 0.0.0.0 &
WEB_PID=$!

# Handle shutdown
cleanup() {
  echo "Shutting down..."
  kill $SERVER_PID 2>/dev/null
  kill $WEB_PID 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
