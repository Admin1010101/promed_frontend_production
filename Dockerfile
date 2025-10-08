# Stage 1: Build the React Application
# Using a more recent Node version for stability
FROM node:20-alpine as build 

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# IMPORTANT CHANGE: Added --legacy-peer-deps to ignore peer dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# CRITICAL CHANGE: Build the React app specifically for the staging environment.
# This ensures the API URL from .env.staging (the Azure URL) is baked into the code.
RUN NODE_ENV=staging npm run build 

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the built files from the previous stage to Nginx's web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration (containing the SPA routing fix)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx runs on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]