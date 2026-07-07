# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace package config and workspace package configs
COPY package*.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY apps/pocketbase/package.json ./apps/pocketbase/

# Install dependencies for the workspace
RUN npm ci -w web

# Cache breaker to force rebuild: 2026-07-06-03-11
COPY apps/web ./apps/web

# Declare build-time arguments and set environment variables for Vite
ARG VITE_API_URL
ARG VITE_POCKETBASE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_POCKETBASE_URL=$VITE_POCKETBASE_URL

# Build Vite application
WORKDIR /app/apps/web
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine

# Copy custom Nginx routing config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist/apps/web /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
