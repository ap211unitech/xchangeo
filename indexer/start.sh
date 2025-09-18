#!/bin/bash
set -euo pipefail

docker compose down -v

# Step 1: Cleanup and build
echo "🧹 Cleaning..."
pnpm clean

echo "⚙️ Preparing..."
pnpm ready

# Step 2: Run Docker Compose at project root
echo "🚀 Starting Docker container..."
docker compose up -d

sleep 30

HARDHAT_NODE_URL="http://localhost:8545"
echo "⏳ Waiting for Hardhat Node at $HARDHAT_NODE_URL..."
until curl -s $HARDHAT_NODE_URL > /dev/null; do
  sleep 2
done
echo "✅ Hardhat Node is ready"

GRAPH_NODE_URL="http://localhost:8020"
echo "⏳ Waiting for Graph Node at $GRAPH_NODE_URL..."
until curl -s $GRAPH_NODE_URL > /dev/null; do
  sleep 2
done
echo "✅ Graph Node is ready"

# Step 3: Create local subgraph and deploy
echo "📦 Creating local subgraph..."
pnpm create-local

echo "📡 Deploying local subgraph..."
pnpm deploy-local

echo "✅ Done!"
