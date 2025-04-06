# # Use the official Node.js image as the base image
# FROM node:18

# # Set the working directory
# WORKDIR /app

# # Copy package.json and yarn.lock files
# COPY package.json package-lock.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of your application code
# COPY . .

# # Build the Next.js application
# RUN npm run build

# # Expose the port your Next.js app runs on
# EXPOSE 3000

# # Start the Next.js application
# CMD ["npm", "start"]
# Stage 1: Build
FROM node:18-alpine AS build

# Set working directory
WORKDIR /opt/app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Set environment variables
ENV NEXT_PUBLIC_API_URL=https://admin.exohaven-iq.com
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

# Set working directory
WORKDIR /opt/app

# Copy necessary files from build stage
COPY --from=build /opt/app/package.json ./
COPY --from=build /opt/app/package-lock.json ./
COPY --from=build /opt/app/next.config.mjs ./
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/.next/standalone ./
COPY --from=build /opt/app/.next/static ./.next/static

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://admin.exohaven-iq.com

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
