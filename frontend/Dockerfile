# Use the lightweight Node.js image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files first to speed up the build (caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the Next.js port
EXPOSE 3000

# Start the app in development mode
CMD ["npm", "run", "dev"]