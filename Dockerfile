# Stage 1: Build the React Application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies with legacy peer deps
# Using npm ci for faster, more reliable builds (if you have package-lock.json)
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy environment files
# IMPORTANT: Make sure .env.staging exists in your repo or is created by CI/CD
COPY .env.staging .env.production ./

# Copy the rest of the application code
COPY . .

# Build the React app for production
# React will automatically use .env.production for production builds
ENV NODE_ENV=production
RUN npm run build

# Verify build output exists
RUN ls -la /app/build && echo "Build completed successfully"

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a simple health check endpoint
RUN echo "OK" > /usr/share/nginx/html/health.txt

# Expose port 80
EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/health.txt || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]