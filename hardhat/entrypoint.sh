#!/bin/sh
set -e

# Start Hardhat node in background
echo "🚀 Starting Hardhat node..."
npx hardhat node --hostname 0.0.0.0 &
NODE_PID=$!

# Wait for node to be ready
echo "⏳ Waiting for Hardhat node..."
until curl -s http://127.0.0.1:8545 > /dev/null; do
  sleep 2
done

# Deploy contracts once
echo "📦 Deploying contracts..."
if npx hardhat ignition deploy ./ignition/modules/index.ts --network localhost; then
  echo "✅ Contracts deployed successfully"
else
  echo "❌ Deployment failed, check logs"
fi

# Keep container alive by attaching to node process
echo "📡 Hardhat node is running..."
wait $NODE_PID
