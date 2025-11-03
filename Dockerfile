# Use Node.js LTS Alpine image for smaller size
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run the application
CMD ["npm", "start"]