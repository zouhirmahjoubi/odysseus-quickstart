FROM node:20-alpine

WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy dependency configs
COPY package.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy application source code
COPY src ./src

# Expose backend API port
EXPOSE 3001

# Start the Express API server
CMD ["node", "src/main.js"]
