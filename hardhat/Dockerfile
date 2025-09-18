FROM node:20-alpine

# Install curl for health checks
RUN apk add --no-cache curl bash

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8545

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
