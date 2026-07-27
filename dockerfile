# Use the official Node.js 18 image
FROM node:18

# Create a working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the project
COPY . .

# Tell Docker the app listens on port 3000
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]