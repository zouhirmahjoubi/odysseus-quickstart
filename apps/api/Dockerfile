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

# Start the Express API server with automated migrations on startup
CMD ["sh", "-c", "npx @better-auth/cli migrate --config ./src/lib/auth.js --yes && node src/main.js"]
