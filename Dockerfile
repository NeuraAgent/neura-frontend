# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies (use npm install instead of npm ci to handle version mismatches)
RUN npm install

# Build arguments for all required environment variables
ARG VITE_API_URL
ARG VITE_WEBSOCKET_URL
ARG VITE_APP_NAME
ARG VITE_APP_VERSION
ARG VITE_SESSION_TTL
ARG NODE_ENV
ARG VITE_MINIO_ACCESS_KEY
ARG VITE_MINIO_SECRET_KEY

ARG VITE_MINIO_BUCKET_NAME
ARG VITE_MINIO_ENDPOINT
ARG VITE_FRONTEND_JWT_TOKEN

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WEBSOCKET_URL=$VITE_WEBSOCKET_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_SESSION_TTL=$VITE_SESSION_TTL
ENV NODE_ENV=$NODE_ENV
ENV VITE_MINIO_ACCESS_KEY=$VITE_MINIO_ACCESS_KEY
ENV VITE_MINIO_SECRET_KEY=$VITE_MINIO_SECRET_KEY

ENV VITE_MINIO_BUCKET_NAME=$VITE_MINIO_BUCKET_NAME
ENV VITE_MINIO_ENDPOINT=$VITE_MINIO_ENDPOINT
ENV VITE_FRONTEND_JWT_TOKEN=$VITE_FRONTEND_JWT_TOKEN

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
